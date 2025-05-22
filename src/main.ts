import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import { join } from 'path';
import * as dotenv from 'dotenv';

// ✅ Charge les variables d'environnement
dotenv.config();

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // ✅ Validation globale des DTOs
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // ✅ Middleware express
    app.use(json());
    app.use(urlencoded({ extended: true }));

    // ✅ CORS config (modifiable en prod dans .env)
    app.enableCors({
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: process.env.CORS_CREDENTIALS === 'true', // facultatif
    });

    // ✅ Servir des fichiers statiques si activé
    if (process.env.SERVE_STATIC === 'true') {
      app.useStaticAssets(join(__dirname, '..', 'public'));
    }

    const PORT = process.env.PORT || 3000;
    await app.listen(PORT, '0.0.0.0');

    console.log(`🚀 Le serveur tourne sur : http://localhost:${PORT}`);
    console.log('📦 Connexion à PostgreSQL :', process.env.DATABASE_NAME);
  } catch (error) {
    console.error('❌ Erreur lors du démarrage de l’application :', error);
    process.exit(1);
  }
}
bootstrap();
