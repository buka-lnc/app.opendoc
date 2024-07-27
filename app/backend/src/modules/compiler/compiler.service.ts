import * as R from 'ramda'
import { EnsureRequestContext, EntityManager } from '@mikro-orm/core'
import { EntityRepository, MikroORM } from '@mikro-orm/mysql'
import { InjectRepository } from '@mikro-orm/nestjs'
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common'
import { Compiler } from './entities/compiler.entity'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import WebSocket from 'ws'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ResponseOfQueryCompilerDTO } from './dto/response-of-query-compiler.dto'
import { QueryCompilersDTO } from './dto/query-compilers.dto'
import { CreateCompilerDTO } from './dto/create-compiler.dto'
import { UpdateCompilerDTO } from './dto/update-compiler.dto'
import { WebSocketService } from './web-socket.service'


@Injectable()
export class CompilerService implements OnModuleInit {
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
  ) {}

  @EnsureRequestContext()
  async onModuleInit() {
    const compilers = await this.compilerRepo.find({
      status: 'enabled',
    })

    for (const compiler of compilers) {
      try {
        const ws = await this.webSocketService.connect(compiler.url)
        ws.on('error', () => {
          this.webSocketMap.delete(compiler.id)
        })
        this.webSocketMap.set(compiler.id, ws)
      } catch (e) {
        this.logger.error(`Cannot connect to compiler: ${compiler.url}`)
      }
    }
  }

  async queryAll(dto: QueryCompilersDTO): Promise<ResponseOfQueryCompilerDTO> {
    const qb = this.compilerRepo.createQueryBuilder('compiler')

    if (!R.isNil(dto.offset)) {
      void qb
        .limit(dto.limit || 10)
        .offset(dto.offset || 0)
    }

    const [results, total] = await qb.getResultAndCount()

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
    await this.webSocketService.send(ws, 'health')
    ws.close()

    const compiler = this.compilerRepo.create({
      url: dto.url,
      status: 'enabled',
    })

    await this.em.persistAndFlush(compiler)
    return compiler
  }

  async update(compilerId: string, dto: UpdateCompilerDTO): Promise<Compiler> {
    const compiler = await this.compilerRepo.findOneOrFail(compilerId)
    compiler.url = dto.url
    await this.em.persistAndFlush(compiler)

    return compiler
  }

  async remove(compilerId: string): Promise<Compiler> {
    const compiler = await this.compilerRepo.findOneOrFail(compilerId)
    await this.em.removeAndFlush(compiler)
    return compiler
  }
}
