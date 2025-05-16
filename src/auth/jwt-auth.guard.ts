import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    //console.log('🔐 Activation du guard JWT');
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err) {
      console.error('❌ Erreur d\'authentification :', err);
      throw new UnauthorizedException('Accès non autorisé. Token invalide ou expiré.');
    }

    if (!user) {
      console.warn('❌ Utilisateur non trouvé dans le JWT');
      throw new UnauthorizedException('Accès non autorisé. Token invalide ou expiré.');
    }

    //console.log(`✅ Utilisateur authentifié : ${user.id_user || user.id_admin_gestionnaire}`);

    return user;
  }
}

@Injectable()
export class JwtAdminGuard extends AuthGuard('jwt-admin') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.role !== 'super_admin') {
      console.warn('❌ Utilisateur non autorisé : pas un administrateur');
      throw new UnauthorizedException('Accès refusé. Vous devez être un administrateur.');
    }

    //console.log(`✅ Administrateur authentifié : ${user.id_admin_gestionnaire}`);

    return result;
  }
}
