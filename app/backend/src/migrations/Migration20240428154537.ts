/* eslint-disable @typescript-eslint/require-await */
import { Migration } from '@mikro-orm/migrations'

const forbiddenCodes = [
  'buka',
  'webpack',
  'rollup',
  'react',
  'vue',
  'angular',
  'nestjs',
  'next',
  'types',
  'nuxt',
  'nuxtjs',
  'tailwindcss',
  'asyncapi',
  'shikijs',
  'vueuse',
  'tabler',
  'pinia',
  'typescript-eslint',
  'eslint',
]

export class Migration20240428154537 extends Migration {
  async up(): Promise<void> {
    this.addSql('create table `forbidden_application_code` (`id` bigint unsigned not null auto_increment primary key comment \'主键\', `created_at` datetime not null default CURRENT_TIMESTAMP comment \'创建时间\', `updated_at` datetime not null default CURRENT_TIMESTAMP comment \'更新时间\', `code` varchar(255) not null comment \'唯一应用编码\');')
    this.addSql('alter table `forbidden_application_code` add unique `forbidden_application_code_code_unique`(`code`);')

    for (const code of forbiddenCodes) {
      this.addSql(`insert into \`forbidden_application_code\` (\`code\`) values ('${code}');`)
    }
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `forbidden_application_code`;')
  }
}
