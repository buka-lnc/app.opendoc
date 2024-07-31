import * as R from 'ramda'
import { EnsureRequestContext, EntityManager } from '@mikro-orm/core'
import { EntityRepository, MikroORM } from '@mikro-orm/mysql'
import { InjectRepository } from '@mikro-orm/nestjs'
import { BadRequestException, Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common'
import { Compiler } from './entities/compiler.entity'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import WebSocket from 'ws'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ResponseOfQueryCompilerDTO } from './dto/response-of-query-compiler.dto'
import { QueryCompilersDTO } from './dto/query-compilers.dto'
import { CreateCompilerDTO } from './dto/create-compiler.dto'
import { UpdateCompilerDTO } from './dto/update-compiler.dto'
import { WebSocketService } from './web-socket.service'
import { CompilerMessageEvent } from './constants/compiler-message-event'
import { Cron } from '@nestjs/schedule'
import { CompilerOption } from './entities/compiler-option.entity'
import { CompilerStatus } from './constants/compiler-status'


@Injectable()
export class CompilerService implements OnModuleInit, OnApplicationShutdown {
  private readonly webSocketMap = new Map<string, WebSocket>()

  constructor(
    @InjectPinoLogger(CompilerService.name)
    private readonly logger: PinoLogger,

    private readonly eventEmitter: EventEmitter2,
    private readonly webSocketService: WebSocketService,

    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    @InjectRepository(Compiler)
    private readonly compilerRepo: EntityRepository<Compiler>,

    @InjectRepository(CompilerOption)
    private readonly compilerOptionRepo: EntityRepository<CompilerOption>,
  ) {}

  async onModuleInit() {
    await this.consistency()
  }

  /**
   * 定时检查
   * 数据库的编译器记录与当前连接的编译器是否一致
   * 若不一致，则恢复成数据库记录的状态
   */
  @Cron('*/10 * * * * *')
  @EnsureRequestContext()
  private async consistency() {
    const compilers = await this.compilerRepo.find({
      status: CompilerStatus.ENABLED,
    })

    for (const compiler of compilers) {
      if (!this.webSocketMap.has(compiler.id)) {
        await this.connectCompiler(compiler)
      }
    }

    const compilerIds = [...this.webSocketMap.keys()]
    const removedCompilerIds = R.difference(compilerIds, R.pluck('id', compilers))

    for (const compilerId of removedCompilerIds) {
      const ws = this.webSocketMap.get(compilerId)
      if (ws) ws.close()
    }
  }

  onApplicationShutdown() {
    for (const ws of this.webSocketMap.values()) {
      ws.close()
    }
  }

  async connectCompiler(compiler: Compiler): Promise<void> {
    for (let i = 0; i < 3; i++) {
      try {
        const ws = await this.webSocketService.connect(compiler.url)
        ws.on('error', (err) => this.logger.error(err))
        ws.on('close', () => this.webSocketMap.delete(compiler.id))

        this.webSocketMap.set(compiler.id, ws)

        break
      } catch (e) {
        this.logger.error(`Cannot connect to compiler: ${compiler.url}`)
      }
    }
  }

  async queryAll(dto: QueryCompilersDTO): Promise<ResponseOfQueryCompilerDTO> {
    const qb = this.compilerRepo.createQueryBuilder('compiler')
      .leftJoinAndSelect('compiler.options', 'options')

    if (!R.isNil(dto.offset)) {
      void qb
        .limit(dto.limit || 10)
        .offset(dto.offset || 0)
    }

    const [results, total] = await qb.getResultAndCount()
    console.log('🚀 ~ CompilerService ~ queryAll ~ results:', results)

    return {
      results,
      pagination: {
        total,
        offset: dto.offset || 0,
        limit: dto.limit || 10,
      },
    }
  }

  async queryById(compilerId: string): Promise<Compiler> {
    return await this.compilerRepo.findOneOrFail(compilerId)
  }

  async create(dto: CreateCompilerDTO): Promise<Compiler> {
    // 提前检查避免额外向compiler发送一次 health check
    const exist = await this.compilerRepo.findOne({
      url: dto.url,
    })
    if (exist) throw new BadRequestException('请勿重复添加')

    const ws = await this.webSocketService.connect(dto.url)
    const compilerInfo = await this.webSocketService.fetch(ws, { event: CompilerMessageEvent.INTRODUCE })
      .finally(() => ws.close())

    const compiler = this.compilerRepo.create({
      url: dto.url,
      status: CompilerStatus.DISABLED,
      name: compilerInfo.name,
      description: '',
      author: compilerInfo.author || '',
      version: compilerInfo.version,
      options: [],
    })

    if (compilerInfo.options) {
      compiler.options.set(compilerInfo.options.map((option) => this.compilerOptionRepo.create({
        key: option.key,
        label: option.label || option.key,
        description: option.description || '',
        format: option.format,
        value: option.value,
        compiler,
      })))
    }

    await this.em.persistAndFlush(compiler)
    return compiler
  }

  async update(compilerId: string, dto: UpdateCompilerDTO): Promise<Compiler> {
    const compiler = await this.compilerRepo.findOneOrFail(compilerId)

    if (dto.options) {
      for (const optionDTO of dto.options) {
        const compilerOption = compiler.options.getItems().find((o) => o.key === optionDTO.key)
        if (!compilerOption) throw new BadRequestException('选项不存在')
        compilerOption.value = optionDTO.value
      }
    }

    if (dto.status) {
      compiler.status = dto.status
    }

    await this.em.persistAndFlush(compiler)
    return compiler
  }

  async remove(compilerId: string): Promise<Compiler> {
    const compiler = await this.compilerRepo.findOneOrFail(compilerId)
    await this.em.removeAndFlush(compiler)
    return compiler
  }
}
