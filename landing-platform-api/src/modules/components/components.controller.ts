import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ComponentsService } from './components.service.js';
import {
  CreateMasterComponentDto,
  UpdateMasterComponentDto,
} from './dto/components.dto.js';

@ApiTags('Reusable Master Components & Symbols')
@Controller('api/v1')
export class ComponentsController {
  constructor(private readonly componentsService: ComponentsService) {}

  @Get('projects/:projectId/components')
  @ApiOperation({ summary: 'List all reusable master components in project' })
  @ApiResponse({ status: 200, description: 'List of master components' })
  getComponentsByProject(@Param('projectId') projectId: string) {
    return {
      success: true,
      data: this.componentsService.getComponentsByProject(projectId),
    };
  }

  @Get('components/:id')
  @ApiOperation({ summary: 'Get a master component by ID' })
  @ApiResponse({ status: 200, description: 'Master component object' })
  getComponentById(@Param('id') id: string) {
    return {
      success: true,
      data: this.componentsService.getComponentById(id),
    };
  }

  @Post('projects/:projectId/components')
  @ApiOperation({ summary: 'Create a new reusable master component' })
  @ApiResponse({ status: 201, description: 'Master component created' })
  createMasterComponent(
    @Param('projectId') projectId: string,
    @Body() dto: CreateMasterComponentDto,
  ) {
    dto.projectId = projectId;
    return {
      success: true,
      data: this.componentsService.createMasterComponent(dto),
    };
  }

  @Put('components/:id')
  @ApiOperation({ summary: 'Update master component definition' })
  @ApiResponse({ status: 200, description: 'Master component updated' })
  updateMasterComponent(
    @Param('id') id: string,
    @Body() dto: UpdateMasterComponentDto,
  ) {
    return {
      success: true,
      data: this.componentsService.updateMasterComponent(id, dto),
    };
  }

  @Delete('components/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a master component' })
  @ApiResponse({ status: 200, description: 'Master component deleted' })
  deleteMasterComponent(@Param('id') id: string) {
    return {
      success: true,
      data: this.componentsService.deleteMasterComponent(id),
    };
  }
}
