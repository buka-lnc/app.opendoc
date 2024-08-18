import { EntityRepository } from '@mikro-orm/mysql'
import { Application } from '../entities/application.entity'
import { RegisterApplicationDTO } from '../dto/register-application.dto'


export class ApplicationRepository extends EntityRepository<Application> {
  async register(dto: RegisterApplicationDTO): Promise<Application> {
    let application = await this.findOne({ code: dto.code })

    if (application) {
      if (dto.title) application.title = dto.title

      return application
    }

    application = this.create({
      code: dto.code,
      title: dto.title || dto.code,
    })

    return application
  }
}
