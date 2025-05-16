import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 587,
      secure: false,
      auth: {
        user: 'startup@explora-studio.com',
        pass: 'Deb@dy4470#Deb@dy4470#', 
      },
    });
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    try {
      const mailOptions = {
        from: `"Explora Studio" <startup@explora-studio.com>`,
        to: email,
        subject: '🔐 Code de vérification - Hostolink',
        html: `
          <div style="max-width:600px;margin:auto;padding:20px;font-family:'Arial',sans-serif;background:#f9f9f9;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.1);">
            
            <div style="padding:30px;background:white;border-radius:0 0 8px 8px;">
              <h2 style="color:#2e6c80;text-align:center;">Votre code OTP</h2>
              <p style="font-size:16px;">Bonjour,</p>
              <p style="font-size:16px;">
                Vous avez demandé un code de vérification pour accéder à votre compte Hostolink.
              </p>
              <p style="font-size:20px;font-weight:bold;text-align:center;margin:30px 0;color:#2e6c80;">
                ${otp}
              </p>
              <p style="font-size:16px;">
                Ce code est valable pendant <strong>5 minutes</strong>. Ne le partagez avec personne.
              </p>

              <div style="text-align:center;">
              <img src="https://res.cloudinary.com/dhrrk7vsd/image/upload/v1740668911/hostolink/axdjirzolotfs3sjrb2v.jpg" alt="Hostolink Banner" style="width:100%;max-width:560px;border-radius:8px 8px 0 0;" />
            </div>


              <hr style="margin:40px 0;" />

              <div style="text-align:center;">
                <img src="https://res.cloudinary.com/dhrrk7vsd/image/upload/v1745780034/i4ilg4vprelrecqpfb1x_x3lnf7.jpg" alt="Logo Explora Studio" style="height:40px;margin-bottom:10px;" />
                <p style="font-size:14px;color:#999;margin:0;">
                  Hostolink – propulsé par Explora Studio
                </p>
                <p style="font-size:12px;color:#bbb;">
                  © ${new Date().getFullYear()} Tous droits réservés.
                </p>
              </div>
            </div>
            
          </div>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      //console.log(`✅ Email OTP envoyé à ${email} | ID: ${info.messageId}`);
    } catch (error) {
      console.error('❌ Erreur lors de l’envoi de l’email :', error);
      throw new InternalServerErrorException('Erreur lors de l’envoi de l’email');
    }
  }
}
