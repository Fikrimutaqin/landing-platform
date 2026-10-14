import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const config = new DocumentBuilder()
        .setTitle('Landing Page Platform API')
        .setDescription('REST API for Component-Based Landing Pages, BYOK Xendit Payments, and Dual-Layer Tracking')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT ?? 4000;
    await app.listen(port);
    console.log(`🚀 Landing Platform API running at: http://localhost:${port}`);
    console.log(`📚 OpenAPI / Swagger documentation at: http://localhost:${port}/api/docs`);
}
await bootstrap();
//# sourceMappingURL=main.js.map