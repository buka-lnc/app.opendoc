import { Injectable } from '@nestjs/common'
import { ExampleDTO } from './dto/example.dto';
import { ExampleFilterDTO } from './dto/example-filter.dto';


@Injectable()
export class ExampleService {
  constructor(
  ) {}

  queryExamples(filter: ExampleFilterDTO): ExampleDTO[] {
    return [
      { id: '1', name: 'example1' },
      { id: '2', name: 'example2' },
    ]
  }
}
