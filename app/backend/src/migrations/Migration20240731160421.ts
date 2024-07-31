/* eslint-disable @typescript-eslint/require-await */
import { Migration } from '@mikro-orm/migrations'

export class Migration20240731160421 extends Migration {
  async up(): Promise<void> {
    this.addSql('create table `compiler` (`id` bigint unsigned not null auto_increment primary key comment \'主键\', `created_at` datetime not null default CURRENT_TIMESTAMP comment \'创建时间\', `updated_at` datetime not null default CURRENT_TIMESTAMP comment \'更新时间\', `status` varchar(15) not null comment \'编译器状态\', `url` varchar(255) not null comment \'编译器地址\', `name` varchar(63) not null comment \'编译器名称\', `description` varchar(255) not null comment \'编译器描述\', `author` varchar(63) not null comment \'编译器名称\', `version` varchar(31) not null comment \'编译器版本\');')
    this.addSql('alter table `compiler` add unique `compiler_url_unique`(`url`);')

    this.addSql('create table `compiler_option` (`id` bigint unsigned not null auto_increment primary key comment \'主键\', `created_at` datetime not null default CURRENT_TIMESTAMP comment \'创建时间\', `updated_at` datetime not null default CURRENT_TIMESTAMP comment \'更新时间\', `key` varchar(63) not null comment \'选项键\', `label` varchar(63) not null comment \'选项名\', `description` varchar(255) not null default \'\' comment \'选项描述\', `format` varchar(31) not null comment \'选项格式\', `value` varchar(255) null comment \'选项值\', `compiler_id` bigint unsigned not null comment \'Compiler\');')
    this.addSql('alter table `compiler_option` add index `compiler_option_compiler_id_index`(`compiler_id`);')
    this.addSql('alter table `compiler_option` add unique `compiler_option_key_compiler_id_unique`(`key`, `compiler_id`);')

    this.addSql('alter table `compiler_option` add constraint `compiler_option_compiler_id_foreign` foreign key (`compiler_id`) references `compiler` (`id`) on update cascade;')
  }

  async down(): Promise<void> {
    this.addSql('alter table `compiler_option` drop foreign key `compiler_option_compiler_id_foreign`;')

    this.addSql('drop table if exists `compiler`;')

    this.addSql('drop table if exists `compiler_option`;')
  }
}
