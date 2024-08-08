import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { PluginService } from './plugin.service'
import { ResponseOfQueryPluginsDTO } from './dto/response-of-query-plugins.dto'
import { QueryPluginsDTO } from './dto/query-plugins.dto'
import { CreatePluginDTO } from './dto/create-plugin.dto'
import { UpdatePluginDTO } from './dto/update-plugin.dto'
import { Plugin } from './entities/plugin.entity'
import { ApiExtraModels } from '@nestjs/swagger'
import { PluginMetadata } from './dto/plugin-command-message/plugin-metadata.dto'
import { PluginEventMessage } from './dto/plugin-event-message.dto'
import { SheetVersionBumpPluginEventMessageData } from './dto/plugin-event-message/sheet-version-bump-plugin-event-message-data.dto'
import { SdkCreatedPluginEventMessageData } from './dto/plugin-event-message/sdk-created-plugin-event-message-data.dto'
import { PluginCommandMessage } from './dto/plugin-command-message.dto'


@ApiExtraModels(
  PluginEventMessage,
  SheetVersionBumpPluginEventMessageData,
  SdkCreatedPluginEventMessageData,

  PluginCommandMessage,
  PluginMetadata,
)
@Controller('plugin')
export class PluginController {
  constructor(
    private readonly pluginService: PluginService,
  ) {}

  @Get()
  async queryPlugins(
    @Query() dto: QueryPluginsDTO,
  ): Promise<ResponseOfQueryPluginsDTO> {
    return this.pluginService.queryAll(dto)
  }

  @Post()
  async createPlugin(
    @Body() dto: CreatePluginDTO
  ): Promise<Plugin> {
    return this.pluginService.create(dto)
  }

  @Get(':pluginId')
  async queryPlugin(
    @Param('pluginId') pluginId: string,
  ): Promise<Plugin> {
    return this.pluginService.queryById(pluginId)
  }

  @Put(':pluginId')
  async updatePlugin(
    @Param('pluginId') pluginId: string,
    @Body() dto: UpdatePluginDTO
  ): Promise<Plugin> {
    return this.pluginService.update(pluginId, dto)
  }

  @Delete(':pluginId')
  async deletePlugin(
    @Param('pluginId') pluginId: string
  ): Promise<Plugin> {
    return this.pluginService.remove(pluginId)
  }
}
