/* eslint-disable @typescript-eslint/require-await */
import { Migration } from '@mikro-orm/migrations'

export class Migration20240725190347 extends Migration {
  async up(): Promise<void> {
    this.addSql('create table `compiler` (`id` bigint unsigned not null auto_increment primary key comment \'主键\', `created_at` datetime not null default CURRENT_TIMESTAMP comment \'创建时间\', `updated_at` datetime not null default CURRENT_TIMESTAMP comment \'更新时间\', `status` varchar(12) not null comment \'编译器状态\', `url` varchar(255) not null comment \'编译器地址\')')
    this.addSql('alter table `compiler` add unique `compiler_url_unique`(`url`);')
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `compiler`;')
  }
}
