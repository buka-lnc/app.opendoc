import { EntityManager, MikroORM } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { RegisterApplicationDTO } from './dto/register-application.dto'
import { Application } from './entity/application.entity'
import { InjectRepository } from '@mikro-orm/nestjs'
import { QueryApplicationsDTO } from './dto/query-applications.dto'
import { QueryApplicationsResponseDTO } from './dto/query-applications-response.dto'
import { EntityRepository } from '@mikro-orm/mysql'


@Injectable()
export class ApplicationService {
  constructor(
    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    @InjectRepository(Application)
    private readonly applicationRepo: EntityRepository<Application>
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

  async queryApplicationByIdOrCode(idOrCode: string): Promise<Application> {
    const app = await this.applicationRepo.findOneOrFail(
      {
        $or: [
          { id: idOrCode },
          { code: idOrCode },
        ],
      },
      {
        populate: ['apiDocuments'],
      }
    )

    return app
  }

  async queryApplications(dto: QueryApplicationsDTO): Promise<QueryApplicationsResponseDTO> {
    const qb = this.applicationRepo.createQueryBuilder('app')
      .select('*')

    if (dto.title) {
      void qb.andWhere({ $like: { title: `%${dto.title}%` } })
    }

    if (dto.limit || dto.offset) {
      void qb.limit(dto.limit || 10).offset(dto.offset || 0)
    }

    const [results, total] = await qb.getResultAndCount()

    return {
      results,
      page: {
        total,
        limit: dto.limit || 10,
        offset: dto.offset || 0,
      },
    }
  }

  async deleteApplication(idOrCode: string): Promise<void> {
    const application = this.applicationRepo.find({
      $or: [
        { id: idOrCode },
        { code: idOrCode },
      ],
    })

    await this.em.removeAndFlush(application)
  }
}
