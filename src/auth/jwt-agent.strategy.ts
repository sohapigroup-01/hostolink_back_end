import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class JwtAgentStrategy extends PassportStrategy(Strategy, 'jwt-agent') {
//   constructor(private readonly configService: ConfigService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: configService.get<string>('JWT_SECRET') || 'defaultSecret',
//       ignoreExpiration: false,
//     });
//   }

//   async validate(payload: any) {
//     return { id: payload.sub, email: payload.email };
//   }
// }


@Injectable()
export class JwtAgentStrategy extends PassportStrategy(Strategy, 'jwt-agent') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET') || 'defaultSecret',
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }
}
