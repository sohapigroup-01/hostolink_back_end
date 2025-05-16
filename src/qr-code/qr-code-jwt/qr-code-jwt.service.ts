// src/qr-code/qr-code-jwt.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { QrCodePayload } from '../interface_qr_code/qr-code-payload.interface';

@Injectable()
export class QrCodeJwtService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  generateToken(payload: QrCodePayload, isStatic: boolean): string {
    const secret = isStatic 
      ? this.configService.get('QR_STATIC_SECRET')
      : this.configService.get('QR_DYNAMIC_SECRET');
    
    const expiresIn = isStatic ? '365d' : '1d';
    
    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
  }

  verifyToken(token: string, isStatic: boolean = false): QrCodePayload {
    try {
      const secret = isStatic 
        ? this.configService.get('QR_STATIC_SECRET')
        : this.configService.get('QR_DYNAMIC_SECRET');
      
      return this.jwtService.verify(token, { secret });
    } catch (error) {
      throw new Error('Token invalide ou expiré');
    }
  }
}