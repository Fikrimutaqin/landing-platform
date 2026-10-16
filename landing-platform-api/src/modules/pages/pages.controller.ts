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
import { PagesService } from './pages.service.js';
import { CreatePageDto, UpdatePageDraftDto, PublishPageDto } from './dto/pages.dto.js';

@ApiTags('Pages & Persistence')
@Controller('api/v1')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get('projects/:projectId/pages')
  @ApiOperation({ summary: 'List all pages in a project' })
  @ApiResponse({ status: 200, description: 'List of page summaries in project' })
  getPagesByProject(@Param('projectId') projectId: string) {
    return {
      success: true,
      data: this.pagesService.getPagesByProject(projectId),
    };
  }

  @Get('pages/:id')
  @ApiOperation({ summary: 'Get full page document by ID' })
  @ApiResponse({ status: 200, description: 'Full PageDocument object' })
  getPageById(@Param('id') id: string) {
    return {
      success: true,
      data: this.pagesService.getPageById(id),
    };
  }

  @Post('projects/:projectId/pages')
  @ApiOperation({ summary: 'Create a new page in project' })
  @ApiResponse({ status: 201, description: 'Page created successfully' })
  createPage(
    @Param('projectId') projectId: string,
    @Body() dto: CreatePageDto,
  ) {
    dto.projectId = projectId;
    return {
      success: true,
      data: this.pagesService.createPage(dto),
    };
  }

  @Put('pages/:id')
  @ApiOperation({ summary: 'Save or update page draft document' })
  @ApiResponse({ status: 200, description: 'Draft saved successfully' })
  updatePageDraft(
    @Param('id') id: string,
    @Body() dto: UpdatePageDraftDto,
  ) {
    return {
      success: true,
      data: this.pagesService.updatePageDraft(id, dto),
    };
  }

  @Post('pages/:id/duplicate')
  @ApiOperation({ summary: 'Duplicate an existing page' })
  @ApiResponse({ status: 201, description: 'Page duplicated' })
  duplicatePage(@Param('id') id: string) {
    return {
      success: true,
      data: this.pagesService.duplicatePage(id),
    };
  }

  @Delete('pages/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a page by ID' })
  @ApiResponse({ status: 200, description: 'Page deleted' })
  deletePage(@Param('id') id: string) {
    return {
      success: true,
      data: this.pagesService.deletePage(id),
    };
  }

  @Post('pages/:id/publish')
  @ApiOperation({ summary: 'Publish current draft to live version snapshot' })
  @ApiResponse({ status: 200, description: 'Page published with snapshot created' })
  publishPage(
    @Param('id') id: string,
    @Body() dto?: PublishPageDto,
  ) {
    return {
      success: true,
      data: this.pagesService.publishPage(id, dto?.notes, dto?.publishedBy),
    };
  }

  @Get('pages/:id/versions')
  @ApiOperation({ summary: 'Get list of published version snapshots for a page' })
  @ApiResponse({ status: 200, description: 'List of version snapshots' })
  getPageVersions(@Param('id') id: string) {
    return {
      success: true,
      data: this.pagesService.getPageVersions(id),
    };
  }

  @Post('pages/:id/rollback/:versionId')
  @ApiOperation({ summary: 'Rollback page draft to a previous published version snapshot' })
  @ApiResponse({ status: 200, description: 'Page rolled back successfully' })
  rollbackPage(
    @Param('id') id: string,
    @Param('versionId') versionId: string,
  ) {
    return {
      success: true,
      data: this.pagesService.rollbackPage(id, versionId),
    };
  }

  @Get('public/pages/:slug')
  @ApiOperation({ summary: 'Public Storefront: Get published page by slug for live rendering' })
  @ApiResponse({ status: 200, description: 'Published page response' })
  getPublicPageBySlug(@Param('slug') slug: string) {
    return {
      success: true,
      data: this.pagesService.getPublicPageBySlug(slug),
    };
  }
}
