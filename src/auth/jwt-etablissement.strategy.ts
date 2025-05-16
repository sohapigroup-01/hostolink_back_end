import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEtablissementSante } from '../user_etablissement_sante/entities/user-etablissement-sante.entity';
import { UserEtablissementSanteService } from 'src/user_etablissement_sante/user-etablissement-sante.service';

@Injectable()
export class JwtEtablissementStrategy extends PassportStrategy(Strategy, 'jwt-etablissement') {
  constructor(
    private configService: ConfigService,
    @InjectRepository(UserEtablissementSante)
    private readonly userRepo: Repository<UserEtablissementSante>,
    @Inject(forwardRef(() => UserEtablissementSanteService))
    private readonly userEtablissementService: UserEtablissementSanteService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) throw new Error('JWT_SECRET est manquant');
  
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      passReqToCallback: true, // ✅ pour accéder à la requête dans validate()
    });
    
  }
  

  async validate(req: Request, payload: { id: number }) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) throw new UnauthorizedException('Token manquant');
  
    // Vérifie si le token est révoqué
    if (this.userEtablissementService.isTokenRevoked(token)) {
      throw new UnauthorizedException('Token révoqué');
    }
  
    const user = await this.userRepo.findOne({ where: { id_user_etablissement_sante: payload.id } });
    if (!user) return null;
  
    //console.log(`✅ [ETAB] Authentifié : ${user.nom} (${user.id_user_etablissement_sante})`);
    return user;
  }
  
  
  
}
