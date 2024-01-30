import { Injectable } from '@nestjs/common'
import { RegisterDocNodeDto } from './dto/register-doc-node.dto'


@Injectable()
export class DocNodeService {
  constructor() {}

  async register(dto: RegisterDocNodeDto): Promise<void> {

  }

  async exists(docNodeMpath: string): Promise<boolean> {
  }

  async ensure(docNodeMpath: string): Promise<void> {
    if (await this.exists(docNodeMpath)) {
      return
    }

    await this.register({
      code: docNodeMpath.split('/').pop(),
      mpath: docNodeMpath,
    })
  }
}
