import { Injectable, InternalServerErrorException } from '@nestjs/common';
import twilio from 'twilio';

@Injectable()
export class SmsService {
  private client: twilio.Twilio;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      throw new InternalServerErrorException('❌ Twilio SID ou Auth Token manquant dans .env');
    }

    this.client = twilio(accountSid, authToken);
  }

  async sendOtpSms(phoneNumber: string, otpCode: string): Promise<void> {
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!fromNumber) {
      throw new InternalServerErrorException('❌ Numéro Twilio manquant dans .env');
    }

    try {
      await this.client.messages.create({
        body: `Akwaba, Voici le code de vérification que vous avez demandé
        
      ${otpCode}. 
        
      Merci de ne pas le partager. Ce code est valable 5 Min après reception.`,
        from: fromNumber,
        to: phoneNumber,
      });
      console.log(`✅ SMS envoyé à ${phoneNumber}`);
    } catch (error) {
      console.error('❌ Erreur Twilio:', error);
      throw new InternalServerErrorException("Échec d'envoi du SMS");
    }
  }
}
