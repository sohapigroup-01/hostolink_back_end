// firebase.config.js
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "hostolink-c00f6", // Votre ID de projet
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
import { messaging } from './firebase.config'; // Importer depuis votre fichier de configuration

async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Obtenir le jeton
      const token = await messaging().getToken({ vapidKey: "YOUR_VAPID_KEY" }); //YOUR VAPID KEY IS VERY IMPORTANT
      //console.log('Jeton FCM :', token);
      // Envoyer le jeton à votre serveur pour le stockage et une utilisation ultérieure.
      // ... envoyer à votre backend (en utilisant fetch ou similaire) ...

    } else {
      //console.log('Autorisation de notification refusée');
    }
  } catch (error) {
    console.error('Erreur lors de la demande d\'autorisation de notification :', error);
  }
}

export default function MyComponent() {
  useEffect(() => {
      requestNotificationPermission();
  }, []); //s'exécute une seule fois après le rendu initial
  //reste du composant
}
