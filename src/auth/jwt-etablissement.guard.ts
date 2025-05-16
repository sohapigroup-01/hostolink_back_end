import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtEtablissementAuthGuard extends AuthGuard('jwt-etablissement') {
    
}
