import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtExpertGuard extends AuthGuard('jwt-expert') {}
