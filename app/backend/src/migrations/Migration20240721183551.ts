/* eslint-disable @typescript-eslint/require-await */
import { Migration } from '@mikro-orm/migrations'
import { forbiddenApplicationCodes } from '../constants/forbidden-application-codes'

export class Migration20240721183551 extends Migration {
  async up(): Promise<void> {
    this.addSql('create table `application` (`id` bigint unsigned not null auto_increment primary key comment \'主键\', `created_at` datetime not null default CURRENT_TIMESTAMP comment \'创建时间\', `updated_at` datetime not null default CURRENT_TIMESTAMP comment \'更新时间\', `code` varchar(63) not null comment \'唯一应用编码\', `title` varchar(127) not null comment \'应用名称\');')
    this.addSql('alter table `application` add unique `application_code_unique`(`code`);')

    this.addSql('create table `forbidden_application_code` (`id` bigint unsigned not null auto_increment primary key comment \'主键\', `created_at` datetime not null default CURRENT_TIMESTAMP comment \'创建时间\', `updated_at` datetime not null default CURRENT_TIMESTAMP comment \'更新时间\', `code` varchar(255) not null comment \'唯一应用编码\', `description` varchar(255) not null default \'\' comment \'描述\');')
    this.addSql('alter table `forbidden_application_code` add unique `forbidden_application_code_code_unique`(`code`);')

    this.addSql('create table `sheet` (`id` bigint unsigned not null auto_increment primary key comment \'主键\', `created_at` datetime not null default CURRENT_TIMESTAMP comment \'创建时间\', `updated_at` datetime not null default CURRENT_TIMESTAMP comment \'更新时间\', `title` varchar(127) not null default \'\' comment \'文档名称\', `code` varchar(63) not null comment \'易于阅读的文档编码(Folder下唯一)\', `order` int not null default 1 comment \'文档排序\', `type` enum(\'markdown\', \'openapi\', \'asyncapi\') not null comment \'文档类型\', `mode` varchar(31) not null default \'push\' comment \'文档同步模式\', `application_id` bigint unsigned not null comment \'文档所属的应用\');')
    this.addSql('alter table `sheet` add index `sheet_code_index`(`code`);')
    this.addSql('alter table `sheet` add index `sheet_application_id_index`(`application_id`);')
    this.addSql('alter table `sheet` add unique `sheet_code_application_id_unique`(`code`, `application_id`);')

    this.addSql('create table `sheet_pull_crontab` (`id` bigint unsigned not null auto_increment primary key comment \'主键\', `created_at` datetime not null default CURRENT_TIMESTAMP comment \'创建时间\', `updated_at` datetime not null default CURRENT_TIMESTAMP comment \'更新时间\', `url` varchar(255) not null comment \'接口地址\', `sheet_id` bigint unsigned not null);')
    this.addSql('alter table `sheet_pull_crontab` add unique `sheet_pull_crontab_sheet_id_unique`(`sheet_id`);')

    this.addSql('create table `sheet_version` (`id` bigint unsigned not null auto_increment primary key comment \'主键\', `created_at` datetime not null default CURRENT_TIMESTAMP comment \'创建时间\', `updated_at` datetime not null default CURRENT_TIMESTAMP comment \'更新时间\', `major` int not null comment \'Major\', `minor` int not null comment \'Minor\', `patch` int not null comment \'Patch\', `prerelease` int not null default 0 comment \'Pre-release\', `tag` varchar(24) not null default \'\' comment \'标签\', `sheet_id` bigint unsigned not null);')
    this.addSql('alter table `sheet_version` add index `sheet_version_sheet_id_index`(`sheet_id`);')
    this.addSql('alter table `sheet_version` add unique `sheet_version_sheet_id_major_minor_patch_tag_prerelease_unique`(`sheet_id`, `major`, `minor`, `patch`, `tag`, `prerelease`);')

    this.addSql('create table `api_file` (`id` bigint unsigned not null auto_increment primary key comment \'主键\', `created_at` datetime not null default CURRENT_TIMESTAMP comment \'创建时间\', `updated_at` datetime not null default CURRENT_TIMESTAMP comment \'更新时间\', `path` varchar(128) not null comment \'文件的路径\', `hash` varchar(10) not null default \'\' comment \'文件的指纹\', `version_id` bigint unsigned not null comment \'版本号\', `sheet_id` bigint unsigned not null comment \'Sheet\');')
    this.addSql('alter table `api_file` add index `api_file_version_id_index`(`version_id`);')
    this.addSql('alter table `api_file` add index `api_file_sheet_id_index`(`sheet_id`);')
    this.addSql('alter table `api_file` add unique `api_file_sheet_id_version_id_path_unique`(`sheet_id`, `version_id`, `path`);')

    this.addSql('create table `sdk` (`id` bigint unsigned not null auto_increment primary key comment \'主键\', `created_at` datetime not null default CURRENT_TIMESTAMP comment \'创建时间\', `updated_at` datetime not null default CURRENT_TIMESTAMP comment \'更新时间\', `scope` varchar(63) not null comment \'organization\', `name` varchar(63) not null comment \'Npm包名\', `compiler` varchar(24) not null comment \'编译器\', `status` varchar(10) not null, `published_at` datetime null, `tarball` varchar(255) null comment \'Npm 压缩包\', `integrity` varchar(100) null comment \'Npm压缩包的sha512\', `version_id` bigint unsigned not null comment \'版本号\', `sheet_id` bigint unsigned not null comment \'所属文档\', `api_file_id` bigint unsigned not null comment \'关联的文档文件\');')
    this.addSql('alter table `sdk` add index `sdk_version_id_index`(`version_id`);')
    this.addSql('alter table `sdk` add index `sdk_sheet_id_index`(`sheet_id`);')
    this.addSql('alter table `sdk` add index `sdk_api_file_id_index`(`api_file_id`);')

    this.addSql('create table `sdk_publish_lock` (`id` bigint unsigned not null auto_increment primary key comment \'主键\', `created_at` datetime not null default CURRENT_TIMESTAMP comment \'创建时间\', `updated_at` datetime not null default CURRENT_TIMESTAMP comment \'更新时间\', `sdk_id` bigint unsigned not null);')
    this.addSql('alter table `sdk_publish_lock` add unique `sdk_publish_lock_sdk_id_unique`(`sdk_id`);')

    this.addSql('alter table `sheet` add constraint `sheet_application_id_foreign` foreign key (`application_id`) references `application` (`id`) on update cascade;')

    this.addSql('alter table `sheet_pull_crontab` add constraint `sheet_pull_crontab_sheet_id_foreign` foreign key (`sheet_id`) references `sheet` (`id`) on update cascade;')

    this.addSql('alter table `sheet_version` add constraint `sheet_version_sheet_id_foreign` foreign key (`sheet_id`) references `sheet` (`id`) on update cascade;')

    this.addSql('alter table `api_file` add constraint `api_file_version_id_foreign` foreign key (`version_id`) references `sheet_version` (`id`) on update cascade;')
    this.addSql('alter table `api_file` add constraint `api_file_sheet_id_foreign` foreign key (`sheet_id`) references `sheet` (`id`) on update cascade;')

    this.addSql('alter table `sdk` add constraint `sdk_version_id_foreign` foreign key (`version_id`) references `sheet_version` (`id`) on update cascade;')
    this.addSql('alter table `sdk` add constraint `sdk_sheet_id_foreign` foreign key (`sheet_id`) references `sheet` (`id`) on update cascade;')
    this.addSql('alter table `sdk` add constraint `sdk_api_file_id_foreign` foreign key (`api_file_id`) references `api_file` (`id`) on update cascade;')

    this.addSql('alter table `sdk_publish_lock` add constraint `sdk_publish_lock_sdk_id_foreign` foreign key (`sdk_id`) references `sdk` (`id`) on update cascade;')

    for (const { code, description } of forbiddenApplicationCodes) {
      this.addSql(`insert into \`forbidden_application_code\` (\`code\`, \`description\`) values (${JSON.stringify(code)}, ${JSON.stringify(description)});`)
    }
  }

  async down(): Promise<void> {
    this.addSql('alter table `sheet` drop foreign key `sheet_application_id_foreign`;')

    this.addSql('alter table `sheet_pull_crontab` drop foreign key `sheet_pull_crontab_sheet_id_foreign`;')

    this.addSql('alter table `sheet_version` drop foreign key `sheet_version_sheet_id_foreign`;')

    this.addSql('alter table `api_file` drop foreign key `api_file_sheet_id_foreign`;')

    this.addSql('alter table `sdk` drop foreign key `sdk_sheet_id_foreign`;')

    this.addSql('alter table `api_file` drop foreign key `api_file_version_id_foreign`;')

    this.addSql('alter table `sdk` drop foreign key `sdk_version_id_foreign`;')

    this.addSql('alter table `sdk` drop foreign key `sdk_api_file_id_foreign`;')

    this.addSql('alter table `sdk_publish_lock` drop foreign key `sdk_publish_lock_sdk_id_foreign`;')

    this.addSql('drop table if exists `application`;')

    this.addSql('drop table if exists `forbidden_application_code`;')

    this.addSql('drop table if exists `sheet`;')

    this.addSql('drop table if exists `sheet_pull_crontab`;')

    this.addSql('drop table if exists `sheet_version`;')

    this.addSql('drop table if exists `api_file`;')

    this.addSql('drop table if exists `sdk`;')

    this.addSql('drop table if exists `sdk_publish_lock`;')
  }
}
