import { EntityManager, MikroORM } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ForbiddenApplicationCode } from './entity/forbidden-application-code.entity'
import { EntityRepository } from '@mikro-orm/mysql'
import { CreateForbiddenApplicationCodeDTO } from './dto/create-forbidden-application-code.dto'


@Injectable()
export class ForbiddenApplicationCodeService {
  constructor(
    private readonly em: EntityManager,
    private readonly orm: MikroORM,

    @InjectRepository(ForbiddenApplicationCode)
    private readonly forbiddenApplicationCodeRepo: EntityRepository<ForbiddenApplicationCode>,
  ) {}

  async isForbidden(code: string): Promise<boolean> {
    const num = await this.forbiddenApplicationCodeRepo.count({ code })
    return !!num
  }


  async queryAll(): Promise<ForbiddenApplicationCode[]> {
    return this.forbiddenApplicationCodeRepo.findAll()
  }

  async create(dto: CreateForbiddenApplicationCodeDTO): Promise<void> {
    if (await this.isForbidden(dto.code)) {
      throw new BadRequestException('应用编码已存在')
    }

    const forbiddenApplicationCode = this.forbiddenApplicationCodeRepo.create({
      code: dto.code,
    })

    await this.em.persistAndFlush(forbiddenApplicationCode)
  }

  async remove(code: string): Promise<void> {
    const forbiddenApplicationCode = await this.forbiddenApplicationCodeRepo.findOne({
      code,
    })

    if (forbiddenApplicationCode) {
      this.em.remove(forbiddenApplicationCode)
      await this.em.flush()
    }
  }
}
