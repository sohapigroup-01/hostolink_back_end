import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../utilisateur/user.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    const secretKey = configService.get<string>('JWT_SECRET');

    if (!secretKey) {
      throw new Error('❌ JWT_SECRET n\'est pas défini dans les variables d\'environnement');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // secretOrKey: secretKey,
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'secretKey',
    });
  }

  async validate(payload: { id_user: string }) {
    //console.log('🔐 Validation du payload JWT :', payload);

    const user = await this.userService.getUserById(payload.id_user);
    if (!user) {
      console.warn(`❌ Utilisateur non trouvé avec l'id : ${payload.id_user}`);
      return null; 
    }

    //console.log(`✅ JWT validé pour l'utilisateur : ${user.id_user}`);

    return user; 
  }
}


