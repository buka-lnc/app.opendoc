import { defineConfig } from '@mikro-orm/mysql'


export default defineConfig({
  entities: ['dist/**/*.entity.js'],
})
