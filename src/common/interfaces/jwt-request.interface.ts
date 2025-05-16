import { Request } from 'express';

export interface JwtRequest extends Request {
  user: {
    id: number;
    email?: string;
    // ajoute d'autres champs si nécessaire
  };
}
