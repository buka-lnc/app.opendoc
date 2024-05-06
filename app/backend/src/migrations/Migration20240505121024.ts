/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/require-await */
import { Migration } from '@mikro-orm/migrations'

const forbiddenCodes = require('./forbidden-application-codes.json')


export class Migration20240505121024 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `forbidden_application_code` add `description` varchar(255) not null comment \'描述\';')

    for (const { code, description } of forbiddenCodes) {
      this.addSql(`insert into \`forbidden_application_code\` (\`code\`, \`description\`) values (${JSON.stringify(code)}, ${JSON.stringify(description)});`)
    }
  }

  async down(): Promise<void> {
    this.addSql('alter table `forbidden_application_code` drop column `description`;')
  }
}
