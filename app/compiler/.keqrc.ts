import { defineKeqConfig, FileNamingStyle } from 'keq-cli'


export default defineKeqConfig({
  outdir: './src/api',
  fileNamingStyle: FileNamingStyle.snakeCase,
  modules: {
    backend: 'http://0.0.0.0:8080/swagger',
  },
})
