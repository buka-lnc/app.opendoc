/* eslint-disable @typescript-eslint/require-await */
import { Migration } from '@mikro-orm/migrations'
import { opendocOptions } from '~/constants/opendoc-options'

export class Migration20240721184048 extends Migration {
  async up(): Promise<void> {
    this.addSql('create table `option` (`id` bigint unsigned not null auto_increment primary key comment \'主键\', `created_at` datetime not null default CURRENT_TIMESTAMP comment \'创建时间\', `updated_at` datetime not null default CURRENT_TIMESTAMP comment \'更新时间\', `key` varchar(63) not null comment \'键\', `value` json not null comment \'值\');')

    for (const key in opendocOptions) {
      this.addSql(`insert into \`option\` (\`key\`, \`value\`) values (${JSON.stringify(key)}, ${JSON.stringify(JSON.stringify(opendocOptions[key]))});`)
    }
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `option`;')
  }
}
