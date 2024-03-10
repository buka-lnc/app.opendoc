import * as R from 'ramda'
import { XSRF_TOKEN_HEADER } from './constants/xsrf-token-header';
import { BadRequestException, Body, Controller, Get, Headers, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common'
import { ExampleService } from './example.service'
import { ExampleDTO } from './dto/example.dto'
import { ApiBasicAuth, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator'
import { ExampleFilterDTO } from './dto/example-filter.dto'


@ApiTags('Example', 'Useless')
@Controller()
@ApiBasicAuth()
@ApiInternalServerErrorResponse({ description: '系统异常' })
export class ExampleController {
  constructor(
    private readonly exampleService: ExampleService,
  ) {}

  @Get('example')
  @ApiOperation({ summary: '查询 Example 列表', description: '查询 Example 列表' })
  @ApiOkResponse({ description: '查询 Example 列表成功', headers: R.mergeAll([XSRF_TOKEN_HEADER]) })
  queryExamples(
    @Query() dto: ExampleFilterDTO,
  ): ExampleDTO[] {
    return this.exampleService.queryExamples(dto)
  }

  @Get('example/:id')
  @ApiOperation({ summary: '查询 Example 详情', description: '查询 Example 详情' })
  @ApiOkResponse({ description: '查询 Example 详情成功', headers: R.mergeAll([XSRF_TOKEN_HEADER]) })
  @ApiException(() => NotFoundException)
  queryExampleById(
    @Param('id') id: string
  ): ExampleDTO {
    return { id, name: 'example' }
  }


  @Post('example')
  @ApiOperation({ summary: '创建 Example', description: '创建 Example' })
  @ApiCreatedResponse({ description: '创建 Example 成功', headers: R.mergeAll([XSRF_TOKEN_HEADER])  })
  @ApiException(() => [BadRequestException], { description: '校验失败' })
  createExample(
    @Headers('Authorization') token: string,
    @Body() dto: ExampleDTO
  ): void {}

  @Patch('example/:id')
  @ApiOperation({ summary: '更新 Example', description: '更新 Example' })
  @ApiOkResponse({ description: '更新 Example 成功', headers: R.mergeAll([XSRF_TOKEN_HEADER]) })
  @ApiException(() => BadRequestException, { description: '校验失败' })
  patchExample(
    @Headers('Authorization') token: string,
    @Param('id') id: string
  ): void {}

  @Post('example/:id')
  @ApiOperation({ summary: '删除 Example', description: '删除 Example' })
  @ApiCreatedResponse({ description: '更新 Example 成功', headers: R.mergeAll([XSRF_TOKEN_HEADER])  })
  @ApiException(() => [NotFoundException, BadRequestException])
  updateExample(
    @Headers('Authorization') token: string,
    @Param('id') id: string
  ): void {}

  @Post('deprecated-example/:id')
  @ApiOperation({
    summary: 'Deprecated Example',
    description: 'This is a deprecated example',
    deprecated: true
  })
  deprecatedExample(
    @Param('id') id: string
  ): void {}
}
