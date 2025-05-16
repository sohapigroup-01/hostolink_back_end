import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentAssistanceService } from './agent-assistant.service';
import { AgentAssistanceController } from './agent-assistant.controller';
import { AgentAssistance } from './entities/agent-assistance.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([AgentAssistance]), // Ceci est important
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_jwt_secret',
      signOptions: { expiresIn: '1d' },
    }),
    PassportModule,
  ],
  controllers: [AgentAssistanceController],
  providers: [AgentAssistanceService],
  exports: [AgentAssistanceService],
})
export class AgentAssistantModule {}