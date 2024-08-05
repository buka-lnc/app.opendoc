/* eslint-disable @typescript-eslint/require-await */
import { Migration } from '@mikro-orm/migrations'
import { forbiddenApplicationCodes } from '../constants/forbidden-application-codes'

export class AddForbiddenApplicationCodes extends Migration {
  async up(): Promise<void> {
    for (const { code, description } of forbiddenApplicationCodes) {
      this.addSql(`insert ignore into \`forbidden_application_code\` (\`code\`, \`description\`) values (${JSON.stringify(code)}, ${JSON.stringify(description)});`)
    }
  }

  async down(): Promise<void> {
  }
}
