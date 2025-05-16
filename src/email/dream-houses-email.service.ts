import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dhrrk7vsd',
  api_key: '197881586145143',
  api_secret: 'HEEz2vCv7MyxBRjCZScbXeUKgEw',
});

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

  async uploadImageFromBuffer(buffer: Buffer): Promise<string> {
    try {
      //console.log('📦 Buffer reçu pour upload (taille) :', buffer?.length);
  
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'dreams-houses-img',
            resource_type: 'auto', 
          },
          (error, result) => {
            if (error) {
              console.error('❌ Erreur Cloudinary :', error);
              reject(error);
            } else {
              //console.log('✅ Upload réussi. URL =', result?.secure_url);
              resolve(result);
            }
          }
        );
  
        Readable.from(buffer).pipe(stream);
      });
  
      return result?.secure_url || '';
    } catch (err) {
      console.error('🔥 Échec complet de l’upload :', err);
      return '';
    }
  }
  
  

  async sendCustomEmail(data: any): Promise<void> {
    const {
      email,
      name,
      phone,
      message,
      propertyTitle,
      propertyLocation,
      propertyPrice,
      imageUrl,
    } = data;

    const html = `
      <div style="padding:20px;font-family:Arial,sans-serif">
        <h2 style="color:#1A237E">Nouvelle demande</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Téléphone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <h3>🏠 Propriété</h3>
        <p><strong>Titre:</strong> ${propertyTitle}</p>
        <p><strong>Lieu:</strong> ${propertyLocation}</p>
        <p><strong>Prix:</strong> ${propertyPrice}</p>
        ${imageUrl ? `<img src="${imageUrl}" style="max-width:100%;margin-top:10px;" />` : ''}
      </div>
    `;

    try {
      const mailOptions = {
        from: `Dreams-Houses" <startup@explora-studio.com>`,
        // to: 'dream.houses.business@gmail.com',
        to: 'debadychatue@gmail.com',
        subject: '📬 Nouvelle demande de réservation',
        html,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException("Échec d'envoi de l'email.");
    }
  }
}
