import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AdministrateurService } from '../administrateur/administrateur.service';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(
    private readonly adminService: AdministrateurService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET') || 'defaultSecret',
      ignoreExpiration: false,
    });
  }

  async validate(payload: { id: number }) {
    if (!payload.id) {
      throw new UnauthorizedException('Token invalide');
    }

    const admin = await this.adminService.getAdminById(payload.id);
    if (!admin) {
      throw new UnauthorizedException('Accès refusé');
    }

    //console.log('Payload JWT:', payload); 
    return admin;
  }
}
