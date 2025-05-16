import * as admin from 'firebase-admin';
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    if (!admin.apps.length) {
        const serviceAccountPath = process.env.FIREBASE_CREDENTIAL_PATH;

        if (!serviceAccountPath) {
          throw new Error('🔥 FIREBASE_CREDENTIAL_PATH n’est pas défini dans le fichier .env');
        }
        
        const absoluteServiceAccountPath = path.join(__dirname, '../../', serviceAccountPath);
        
        if (!fs.existsSync(absoluteServiceAccountPath)) {
          throw new Error(`🚨 Le fichier Firebase credentials est introuvable : ${absoluteServiceAccountPath}`);
        }
        
        const serviceAccount = JSON.parse(fs.readFileSync(absoluteServiceAccountPath, 'utf8'));
        

      //console.log('✅ Firebase Admin SDK initialisé avec succès !');
    }
  }
}
