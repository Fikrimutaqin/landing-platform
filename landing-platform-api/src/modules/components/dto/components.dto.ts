import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateMasterComponentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  projectId?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: 'navigation' | 'hero' | 'cards' | 'cta' | 'footer' | 'general';

  @IsString()
  @IsOptional()
  rootType?: 'block' | 'component';

  @IsOptional()
  blockData?: any;

  @IsOptional()
  componentData?: any;
}

export class UpdateMasterComponentDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: 'navigation' | 'hero' | 'cards' | 'cta' | 'footer' | 'general';

  @IsOptional()
  blockData?: any;

  @IsOptional()
  componentData?: any;
}
