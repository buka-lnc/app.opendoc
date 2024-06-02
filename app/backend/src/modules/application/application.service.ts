import * as R from 'ramda'
import { ForbiddenApplicationCodeService } from './forbidden-application-code.service'
import { EntityManager, MikroORM } from '@mikro-orm/core'
import { BadRequestException, Injectable } from '@nestjs/common'
import { RegisterApplicationDTO } from './dto/register-application.dto'
import { Application } from './entity/application.entity'
import { InjectRepository } from '@mikro-orm/nestjs'
import { QueryApplicationsDTO } from './dto/query-applications.dto'
import { ResponseOfQueryApplicationsDTO } from './dto/response-of-query-applications.dto'
import { EntityRepository } from '@mikro-orm/mysql'
import { CreateApplicationDTO } from './dto/create-application.dto'


@Injectable()
export class ApplicationService {
  constructor(
    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    @InjectRepository(Application)
    private readonly applicationRepo: EntityRepository<Application>,

    private readonly forbiddenApplicationCodeService: ForbiddenApplicationCodeService
  ) {}

  async register(dto: RegisterApplicationDTO): Promise<void> {
    let application = await this.applicationRepo.findOne({
      code: dto.code,
    })

    if (application) {
      if (dto.title) application.title = dto.title

      await this.em.persistAndFlush(application)
      return
    }

    application = this.applicationRepo.create({
      code: dto.code,
      title: dto.title || dto.code,
    })

    await this.em.persistAndFlush(application)
  }

  async create(dto: CreateApplicationDTO): Promise<Application> {
    const isForbidden = await this.forbiddenApplicationCodeService.isForbidden(dto.code)

    if (isForbidden) {
      throw new BadRequestException('应用编码已被禁用')
    }

    const application = this.applicationRepo.create({
      code: dto.code,
      title: dto.title || dto.code,
    })
    await this.em.persistAndFlush(application)

    return application
  }

  async queryByIdOrCode(idOrCode: string): Promise<Application> {
    const app = await this.applicationRepo.findOneOrFail({
      $or: [
        { id: idOrCode },
        { code: idOrCode },
      ],
    })

    return app
  }

  async queryAll(dto: QueryApplicationsDTO): Promise<ResponseOfQueryApplicationsDTO> {
    const qb = this.applicationRepo.createQueryBuilder('app')
      .select('*')

    if (dto.title) {
      void qb.andWhere({ title: { $like: `%${dto.title}%` } })
    }

    if (dto.code) {
      void qb.andWhere({ code: { $like: `%${dto.code}%` } })
    }

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
        limit: dto.limit || 10,
        offset: dto.offset || -1,
      },
    }
  }

  async remove(idOrCode: string): Promise<void> {
    const application = await this.applicationRepo.find(
      {
        $or: [
          { id: idOrCode },
          { code: idOrCode },
        ],
      },
      {
        populate: [
          'sheets',
          'sheets.versions',
          'sheets.pullCrontab',
          'sheets.apiFiles',
          'sheets.apiFiles.sdks',
          'sheets.apiFiles.sdks.sdkPublishLock',
        ],
      }
    )

    if (!application) return

    this.em.remove(application)
    await this.em.flush()
  }
}
