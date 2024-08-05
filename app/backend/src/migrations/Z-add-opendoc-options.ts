/* eslint-disable @typescript-eslint/require-await */
import { Migration } from '@mikro-orm/migrations'
import { opendocOptions } from '~/constants/opendoc-options'

export class Migration20240721184048 extends Migration {
  async up(): Promise<void> {
    for (const key in opendocOptions) {
      this.addSql(`insert ignore into \`option\` (\`key\`, \`value\`) values (${JSON.stringify(key)}, ${JSON.stringify(JSON.stringify(opendocOptions[key]))});`)
    }
  }

  async down(): Promise<void> {
  }
}
