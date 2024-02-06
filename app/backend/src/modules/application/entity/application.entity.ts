import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core'
import { BaseEntity } from '~/entities/base.entity'
import { ApiDocument } from '~/modules/api-document/entities/api-document.entity'

@Entity()
export class Application extends BaseEntity {
  @Property({
    columnType: 'varchar(63)',
    unique: true,
    comment: '唯一应用编码',
  })
  code: string

  @Property({
    columnType: 'varchar(127)',
    comment: '应用名称',
  })
  title: string

  @OneToMany({
    entity: () => ApiDocument,
    mappedBy: 'application',
  })
  apiDocuments: Collection<ApiDocument>
}
