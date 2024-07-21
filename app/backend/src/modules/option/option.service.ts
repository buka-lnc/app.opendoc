import { EntityManager } from '@mikro-orm/core'
import { EntityRepository, MikroORM } from '@mikro-orm/mysql'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { Option } from './entities/option.entity'
import { OpendocOptions } from './types/opendoc-options'


@Injectable()
export class OptionService {
  constructor(
    @InjectPinoLogger(OptionService.name)
    private readonly logger: PinoLogger,

    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    @InjectRepository(Option)
    private readonly optionRepo: EntityRepository<Option>,
  ) {}

  async get<T extends keyof OpendocOptions>(key: T): Promise<OpendocOptions[T]> {
    const option = await this.optionRepo.findOneOrFail({ key })
    return option.value
  }

  async set(key: string, value) {
    const option = await this.optionRepo.findOneOrFail({ key })
    option.value = value

    await this.em.persistAndFlush(option)
    this.logger.info(`Option ${key} set to ${value}`)
  }
}
