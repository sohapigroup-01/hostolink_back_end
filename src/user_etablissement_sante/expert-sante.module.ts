import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExpertSante } from './entities/expert_sante.entity';
import { ExpertSanteController } from './expert-sante.controller';
import { ExpertSanteService } from './expert-sante.service';
import { JwtExpertStrategy } from './strategies/jwt-expert.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExpertSante]),
    ConfigModule, // assure la lecture du .env

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [ExpertSanteController],
  providers: [ExpertSanteService,JwtExpertStrategy],
})
export class ExpertSanteModule {}
