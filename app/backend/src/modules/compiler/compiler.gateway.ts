import * as semver from 'semver'
import { CompilerIncomingMessageEvent } from './events/compiler-incoming-message.event'
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { CompilerEvent } from './constants/compiler-message-event'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { EnsureRequestContext, EntityManager } from '@mikro-orm/core'
import { EntityRepository, MikroORM } from '@mikro-orm/mysql'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Compiler } from './entities/compiler.entity'
import { version as OPENDOC_VERSION } from '~~/package.json'
import { CompilerService } from './compiler.service'
import { CompilerOption } from './entities/compiler-option.entity'


@Injectable()
export class CompilerGateway {
  constructor(
    @InjectPinoLogger(CompilerGateway.name)
    private readonly logger: PinoLogger,

    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    private readonly compilerService: CompilerService,

    @InjectRepository(Compiler)
    private readonly compilerRepo: EntityRepository<Compiler>,

    @InjectRepository(CompilerOption)
    private readonly compilerOptionRepo: EntityRepository<CompilerOption>,
  ) {}

  @OnEvent('compiler.compiler-information')
  @EnsureRequestContext()
  async updateCompilerInformation(message: CompilerIncomingMessageEvent<CompilerEvent.COMPILER_INFORMATION>) {
    const compiler = await this.compilerRepo.findOne(message.compilerId)
    if (!compiler) {
      this.logger.error(`compiler.update-compiler-information failed: Compiler ${message.compilerId} not found`)
      return
    }

    const data = message.data

    try {
      this.compilerService.validateApiVersion(data.apiVersion)
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(`compiler.update-compiler-information failed: ${err.message}`)
      } else {
        this.logger.error(err)
      }
    }


    if (!semver.satisfies(OPENDOC_VERSION, data.apiVersion)) {
      return
    }

    if (data.name) compiler.name = data.name
    if (data.description) compiler.description = data.description
    if (data.author) compiler.author = data.author
    if (data.version) compiler.version = data.version
    if (data.options) {
      const options = data.options

      compiler.options.remove((item) => options.every((option) => option.key !== item.key))

      for (const [index, option] of options.entries()) {
        let o = compiler.options.find((item) => item.key === option.key)

        if (!o) {
          o = this.compilerOptionRepo.create({
            key: option.key,
            description: option.description || '',
            label: option.label || option.key,
            format: option.format,
            order: index + 1,
            value: option.value,
            compiler,
          })
        } else {
          o.description = option.description || ''
          o.label = option.label || option.key
          o.format = option.format
          o.order = index + 1
        }
      }
    }

    await this.em.persistAndFlush(compiler)
  }
}
