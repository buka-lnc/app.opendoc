import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { CompilerService } from './compiler.service'
import { ResponseOfQueryCompilerDTO } from './dto/response-of-query-compiler.dto'
import { QueryCompilersDTO } from './dto/query-compilers.dto'
import { CreateCompilerDTO } from './dto/create-compiler.dto'
import { UpdateCompilerDTO } from './dto/update-compiler.dto'
import { Compiler } from './entities/compiler.entity'


@Controller('compiler')
export class CompilerController {
  constructor(
    private readonly compilerService: CompilerService,
  ) {}

  @Get()
  async queryCompilers(
    @Query() dto: QueryCompilersDTO,
  ): Promise<ResponseOfQueryCompilerDTO> {
    return this.compilerService.queryAll(dto)
  }

  @Post()
  async createCompiler(
    @Body() dto: CreateCompilerDTO
  ): Promise<Compiler> {
    return this.compilerService.create(dto)
  }

  @Get(':compilerId')
  async queryCompiler(
    @Param('compilerId') compilerId: string,
  ): Promise<Compiler> {
    return this.compilerService.queryById(compilerId)
  }

  @Put(':compilerId')
  async updateCompiler(
    @Param('compilerId') compilerId: string,
    @Body() dto: UpdateCompilerDTO
  ): Promise<Compiler> {
    return this.compilerService.update(compilerId, dto)
  }

  @Delete(':compilerId')
  async deleteCompiler(
    @Param('compilerId') compilerId: string
  ): Promise<Compiler> {
    return this.compilerService.remove(compilerId)
  }
}
