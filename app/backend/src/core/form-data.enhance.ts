import { INestApplication } from '@nestjs/common'
import { urlencoded } from 'express'


export function FormDataEnhance(app: INestApplication): void {
  app.use(urlencoded({ extended: true, limit: '50mb' }))
}
