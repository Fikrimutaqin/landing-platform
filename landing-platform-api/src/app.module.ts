import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PagesModule } from './modules/pages/pages.module.js';
import { ComponentsModule } from './modules/components/components.module.js';

@Module({
  imports: [PagesModule, ComponentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
