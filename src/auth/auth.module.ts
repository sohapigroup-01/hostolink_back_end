import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy'; 
import { UserModule } from '../utilisateur/user.module'; 
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller'; 
import { JwtAdminStrategy } from './jwt-admin.strategy';
import { AdministrateurModule } from 'src/administrateur/administrateur.module';
import { UserEtablissementSanteModule } from 'src/user_etablissement_sante/user-etablissement-sante.module';
import { JwtAgentStrategy } from './jwt-agent.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    AdministrateurModule,
    ConfigModule, 
    UserModule, 
    UserEtablissementSanteModule,
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    JwtModule.registerAsync({
      imports: [ConfigModule], 
      inject: [ConfigService], 
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), 
        signOptions: { expiresIn: '1h' }, 
      }),
    }),
  ],
  controllers: [AuthController], 
  providers: [AuthService, JwtStrategy,JwtAdminStrategy, JwtAgentStrategy], 
  exports: [AuthService, JwtStrategy, PassportModule, JwtModule], 
})
export class AuthModule {}
