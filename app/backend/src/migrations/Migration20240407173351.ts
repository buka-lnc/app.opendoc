/* eslint-disable @typescript-eslint/require-await */
import { Migration } from '@mikro-orm/migrations'

export class Migration20240407173351 extends Migration {
  async up(): Promise<void> {
    this.addSql('create table `application` (`id` bigint unsigned not null auto_increment primary key comment \'主键\', `created_at` datetime not null default CURRENT_TIMESTAMP comment \'创建时间\', `updated_at` datetime not null default CURRENT_TIMESTAMP comment \'更新时间\', `code` varchar(63) not null comment \'唯一应用编码\', `title` varchar(127) not null comment \'应用名称\')')
    this.addSql('alter table `application` add unique `application_code_unique`(`code`);')

    this.addSql('create table `api_document` (`id` bigint unsigned not null auto_increment primary key comment \'主键\', `created_at` datetime not null default CURRENT_TIMESTAMP comment \'创建时间\', `updated_at` datetime not null default CURRENT_TIMESTAMP comment \'更新时间\', `type` enum(\'markdown\', \'openapi\', \'asyncapi\') not null comment \'文档类型\', `code` varchar(63) not null comment \'易于阅读的文档编码(Folder下唯一)\', `order` int not null default 1 comment \'文档排序\', `title` varchar(127) not null default \'\' comment \'文档名称\', `mode` varchar(31) not null default \'push\' comment \'文档同步模式\', `cron_sync_url` varchar(255) null comment \'文档文件的定时同步地址\', `application_id` bigint unsigned not null comment \'文档所属的应用\')')
    this.addSql('alter table `api_document` add index `api_document_code_index`(`code`);')
    this.addSql('alter table `api_document` add index `api_document_application_id_index`(`application_id`);')
    this.addSql('alter table `api_document` add unique `api_document_application_id_code_unique`(`application_id`, `code`);')

    this.addSql('create table `api_document_file` (`id` bigint unsigned not null auto_increment primary key comment \'主键\', `created_at` datetime not null default CURRENT_TIMESTAMP comment \'创建时间\', `updated_at` datetime not null default CURRENT_TIMESTAMP comment \'更新时间\', `hash` varchar(10) not null default \'\' comment \'文档文件的指纹\', `tag` varchar(24) null comment \'文档文件的标签\', `version` varchar(63) not null default \'1.0.0\' comment \'文档文件的版本\', `api_document_id` bigint unsigned not null comment \'文档\')')
    this.addSql('alter table `api_document_file` add index `api_document_file_api_document_id_index`(`api_document_id`);')
    this.addSql('alter table `api_document_file` add unique `api_document_file_api_document_id_version_unique`(`api_document_id`, `version`);')

    this.addSql('create table `sdk` (`id` bigint unsigned not null auto_increment primary key comment \'主键\', `created_at` datetime not null default CURRENT_TIMESTAMP comment \'创建时间\', `updated_at` datetime not null default CURRENT_TIMESTAMP comment \'更新时间\', `scope` varchar(63) not null comment \'organization\', `name` varchar(63) not null comment \'Npm包名\', `compiler` varchar(24) not null comment \'编译器\', `version` varchar(63) not null comment \'版本\', `tag` varchar(24) null comment \'标签\', `status` varchar(10) not null, `published_at` datetime null, `tarball` varchar(255) null comment \'Npm 压缩包\', `integrity` varchar(100) null comment \'Npm压缩包的sha512\', `api_document_id` bigint unsigned not null comment \'所属文档\', `api_document_file_id` bigint unsigned not null comment \'关联的文档文件\')')
    this.addSql('alter table `sdk` add index `sdk_api_document_id_index`(`api_document_id`);')
    this.addSql('alter table `sdk` add index `sdk_api_document_file_id_index`(`api_document_file_id`);')

    this.addSql('create table `sdk_publish_lock` (`id` bigint unsigned not null auto_increment primary key comment \'主键\', `created_at` datetime not null default CURRENT_TIMESTAMP comment \'创建时间\', `updated_at` datetime not null default CURRENT_TIMESTAMP comment \'更新时间\', `sdk_id` bigint unsigned not null)')
    this.addSql('alter table `sdk_publish_lock` add unique `sdk_publish_lock_sdk_id_unique`(`sdk_id`);')

    this.addSql('alter table `api_document` add constraint `api_document_application_id_foreign` foreign key (`application_id`) references `application` (`id`) on update cascade;')

    this.addSql('alter table `api_document_file` add constraint `api_document_file_api_document_id_foreign` foreign key (`api_document_id`) references `api_document` (`id`) on update cascade;')

    this.addSql('alter table `sdk` add constraint `sdk_api_document_id_foreign` foreign key (`api_document_id`) references `api_document` (`id`) on update cascade;')
    this.addSql('alter table `sdk` add constraint `sdk_api_document_file_id_foreign` foreign key (`api_document_file_id`) references `api_document_file` (`id`) on update cascade;')

    this.addSql('alter table `sdk_publish_lock` add constraint `sdk_publish_lock_sdk_id_foreign` foreign key (`sdk_id`) references `sdk` (`id`) on update cascade;')
  }
}
