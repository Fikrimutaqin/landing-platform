import { IsString, IsNotEmpty, IsOptional, IsArray, IsObject } from 'class-validator';

export class CreatePageDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsOptional()
  templateKey?: string;
}

export class UpdatePageDraftDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsArray()
  @IsOptional()
  blocks?: any[];

  @IsObject()
  @IsOptional()
  tokens?: any;

  @IsArray()
  @IsOptional()
  styleClasses?: any[];

  @IsObject()
  @IsOptional()
  seoMetadata?: any;
}

export class PublishPageDto {
  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  publishedBy?: string;
}

export class RollbackPageDto {
  @IsString()
  @IsNotEmpty()
  versionId: string;
}
