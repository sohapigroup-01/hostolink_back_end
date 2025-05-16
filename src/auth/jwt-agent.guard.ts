// src/guards/jwt-agent-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAgentAuthGuard extends AuthGuard('jwt-agent') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new Error('Vous n\'êtes pas un agent assistant');
    }
    return user;
  }
}