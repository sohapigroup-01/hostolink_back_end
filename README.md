
// DANS LA BASE DE DONNER
J AI AJOUTE LE CHAMP CATEGORIE A LA TABLE LISTE NUMERO VERT ETABLISSEMENT SANTE

#                   INITIATION DU PROJET NETJS
# Hostolink Backend

Bienvenue dans le backend de **Hostolink**, une API construite avec **NestJS**, **PostgreSQL**, et **Docker** pour gérer les fonctionnalités de paiement et d'épargne pour les soins de santé.

## 🚀 Fonctionnalités principales
- Gestion des utilisateurs (authentification, rôles, permissions)
- Transactions financières (dépôt, retrait, transfert)
- Intégration avec des services de paiement (Wave, PayPal, etc.)
- Géolocalisation des établissements de santé
- Notifications en temps réel avec Firebase
- Sécurité renforcée (JWT, bcrypt, validation des requêtes)

---

## 📦 Prérequis
Avant de commencer, assurez-vous d'avoir installé :

- [Node.js](https://nodejs.org/) (version 18+)
- [NestJS CLI](https://docs.nestjs.com/) (`npm install -g @nestjs/cli`)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/) (optionnel, mais recommandé)
- [Télécharger] https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

---

## ⚙️ Installation
Clonez le projet et installez les dépendances :

```sh
# Cloner le dépôt
git clone https://github.com/votre-utilisateur/hostolink-backend.git
cd hostolink-backend

# Installer les dépendances
npm install
```

---

## 🛠️ Configuration
Avant de démarrer l'API, configurez l'environnement :

1. **Dupliquez** le fichier `.env.example` et renommez-le `.env`
2. **Modifiez** les variables selon votre environnement :

```env Local
PORT=3000
DATABASE_URL=postgresql://postgres:motdepasse@localhost:5432/hostolink_bd
JWT_SECRET=secret_jwt
FIREBASE_API_KEY=xxx
```

```env Sur render
# ✅ Connexion PostgreSQL sur Supabase via le pooler avec SSL activé
DB_HOST=................supabase.com
DB_PORT=........
DB_NAME=......
DB_USER=postgres.............
DB_PASSWORD=......
DB_SSL=true

# ✅ Configuration de Cloudinary
CLOUDINARY_CLOUD_NAME=...........
CLOUDINARY_API_KEY=...............
CLOUDINARY_API_SECRET=..............

# ✅ Clé secrète pour JWT
JWT_SECRET=................
```

---

## 🏗️ Démarrer le serveur

### 🔹 Mode développement
```sh
npm run start:dev
```
L'API sera accessible sur `http://localhost:3000`

### 🔹 Mode production
```sh
npm run build
npm run start:prod
```

---

## 🛠️ Utilisation avec Docker
Si vous utilisez **Docker**, vous pouvez lancer le projet sans installer PostgreSQL localement :

```sh
# Démarrer PostgreSQL via Docker
docker-compose up -d
```

---

## 📡 Documentation API
Une documentation **Swagger** est disponible après le démarrage du serveur :

Accédez à : [http://localhost:3000/api](http://localhost:3000/api)

---

## 🔍 Structure du projet
```
📂 src/
 ├── auth/            # Gestion de l'authentification (JWT, rôles)
 ├── users/           # Gestion des utilisateurs
 ├── transactions/    # Gestion des paiements et transferts
 ├── establishments/  # Géolocalisation des établissements de santé
 ├── notifications/   # Notifications en temps réel (Firebase)
 ├── app.module.ts    # Module principal
 ├── main.ts          # Point d'entrée de l'application
```

---

## 🧪 Tests
Exécutez les tests unitaires avec :
```sh
npm run test
```

Ou les tests e2e :
```sh
npm run test:e2e
```

---



## 📜 Licence
Ce projet est sous licence **MIT**. Consultez le fichier `LICENSE` pour plus de détails.

---

## 📞 Contact
Si vous avez des questions, contactez-nous à **contact@hostolink.com** ou ouvrez une issue sur GitHub.

---

🚀 **Développé avec ❤️ par l'équipe Hostolink** https://sohapigroup-communication
        
        

#                          CONFIGURATION DE BASE


        Installer en s'assurant d'avoir cocher
            ✅ PostgreSQL Server
            ✅ pgAdmin 4
            ✅ Command Line Tools (Important !)
            ✅ Stack Builder
            Définis un mot de passe pour l’utilisateur postgres (NGUESSAN)
            Choisis le port par défaut (5432) (ne change pas sauf si nécessaire)
            Termine l’installation et redémarre le PC

        - toucher Win > taper variable d'environnement > sous variale systeme > path > modifier > nouveau > coller > C:\Program Files\PostgreSQL\17\bin

        - Dans l'zxplorateur de fichier naviguer vers 
            >C:\Program Files\PostgreSQL\17\data

            ouvrir pg_hba.conf dans un éditeur puis rajouter 
            >host    all             all             127.0.0.1/32            scram-sha-256
        
        - Ouvir le cmd et taper
            > psql -U postgres
            entrer le mdp , rendu postgres=#

        - Lister les bd 
            > \l 
        
        - Lister les utilisateur 
            > \du

        -Créer un utilisateur 
            >CREATE USER dev_sohapigroup WITH PASSWORD 'mdp_devç_sohapigroup';

        -Donner tous les autorisations 
            > ALTER USER dev_sohapigroup WITH SUPERUSER CREATEDB CREATEROLE;

        -Se connecter avec  
            > psql -U dev_sohapigroup -d postgres
            mdp
        
        -Créer la base de données
            >createdb -U postgres hostolink_bd

        -Importer la base de données en fichiers sql (sauvagarde custom (.dump ou .backup).)
            > pg_restore -U postgres -d hostolink_bd "C:\Users\NGUESSAN.DESKTOP-38E6PIP\Desktop\SohapiGroup\hostolink_back-end\bd\hostolink_bd.sql"

        - Se connecter 
            > psql -U postgres -d hostolink_bd
        
        - Lister les tables 
            > \dt


#                 CONNECTER CETTE BD AU BACK-END(netjs) ET AU FRONT-END(flutter)*

        - Ouvrir le projet back-end dans un éditeur 
            dans le fichier C:\Users\NGUESSAN.DESKTOP-38E6PIP\Desktop\SohapiGroup\hostolink_back-end\src\app.module.ts

            mettre le nom de l'utilisateur 
            son mdp 
            le nom de la base de donnée
        
        -Créer un dossier pour une entité donné (user)
            préciser les champs leur types et restriction
        
        -Créer les services et controller (a documenté)
        -ouvrir un cmd et taper 
            > npm run start

            s'il y'a des erreurs d'installation, les installés  et reprendre la commande

        - Ouvrir son navigateur puis taper
            > http://localhost:3000/users

            afficher tous les données dans la table utilisateurs

        -  Ouvrir le projet  fron-end , flutter dans un éditeur (VsCode)

        -Créer un fichier qui servira d'api dans le dossier services

        -installer la dependance htpp
        pour communiquer avec le back-end

        - mettre le code de connexion au back-end
            Importer de cette dependance
            présiser l'URL de l'API
            préciser le mot clé de l'entité dans le back-end genre comme route en laravel
            recuper les utilisateur prévoir le cas d'erreur et mettre 
            préciser les champs à remplir , url , le type de donnée json et les valeurs 

        - Créer un fichiers pour afficher et inserer des données 
        - mettre sa classe dans le fichiers routes ou directement dans main.dart

        -faire 
            > flutter clean 
            > flutter pub get 
            > flutter run (Chrome)


#                       TEST DES ENPOINT AVEC POSTMAN

        - Installer et se connecter à son compte 
        -inviter les collab
        - créer une colection 

*-    ok - 1- MISSION : Vérifier si un utilisateur existe*
    Méthode : POST
    URL : http://localhost:3000/api/check-user
    BODY 
        {
        "identifier": "testemail@gmail.com"
        }

    
*-    ok - 2- MISSION : Enregistrer un utilisateur (Sans mot de passe)*
    Méthode : POST
    URL : http://localhost:3000/api/register-user
    BODY 
        {
        "identifier": "testemail@gmail.com"
        }

    
*-    ok - 3-MISSION : Définir un mot de passe après inscription*
    Méthode : POST
    URL :http://localhost:3000/api/define-password
    BODY 
        {
        "identifier": "testemail@gmail.com",
        "password": "MonMotDePasse123"
        }

*-    ok - 4-MISSION : Générer un OTP*
    Méthode : POST
    URL : http://localhost:3000/api/generate-otp
    BODY 
        {
        "identifier": "testemail@gmail.com"
        }


*-    ok - 5-MISSION :  Vérifier un OTP*
    Méthode : POST
    URL : http://localhost:3000/api/verify-otp
    BODY 
        {
        "identifier": "testemail@gmail.com",
        "otpCode": "123456"
        }



*-    ok - 6-MISSION :   Vérifier le PIN (mot de passe)*
    Méthode : POST
    URL : http://localhost:3000/api/verify-pin
    BODY 
        {
        "identifier": "testemail@gmail.com",
        "otpCode": "123456"
        }
    
*-    ok -7-MISSION :Récupérer tous les utilisateurs (Test Admin uniquement)*
    Méthode : POST
    URL : http://localhost:3000/api/verify-pin
    BODY 
        {
        "identifier": "testemail@gmail.com",
        "otpCode": "123456"
        }
    
*-    ok -7-MISSION :Récupérer tous les utilisateurs (Test Admin uniquement)*
    Méthode : POST
    URL : http://localhost:3000/api/verify-pin
    BODY 
        {
        "identifier": "testemail@gmail.com",
        "otpCode": "123456"
        }

*----------RECAP DES ENDPINT DEVELOPPER ------------------*

    🎯 Objectif initial :
     mettre en place un système d’authentification sécurisé dans ton back-end NestJS avec :

    🔑 Inscription & Gestion du mot de passe
        📲 Génération et vérification de l’OTP
        🔒 Connexion sécurisée avec JWT
        🔍 Récupération des données utilisateur après authentification
        ✅ Ce qu’on a fait jusqu’à présent :
    1️⃣ Gestion des utilisateurs

        ✔ Vérification de l'existence d’un utilisateur → /api/check-user
        ✔ Création d’un compte sans mot de passe → /api/register-user
        ✔ Définition d’un mot de passe → /api/define-password

    2️⃣ OTP (One-Time Password)
        ✔ Génération d’un OTP → /api/generate-otp
        ✔ Vérification d’un OTP → /api/verify-otp

    3️⃣ Authentification avec JWT
        ✔ Mise en place de JWT (@nestjs/jwt et passport-jwt)
        ✔ Connexion et génération d’un Token JWT → /api/auth/login
        ✔ Création d’un JwtStrategy et JwtAuthGuard
        ✔ Vérification du Token JWT pour récupérer les infos utilisateur → /api/user/me

    🛠 Ce qu'on a mis en place au niveau du code :

        📁 ENSPOINT INSCRIPTION - CONNEXION - OTP - TOKEN CONNEXION  :
            - user.controller.ts → Routes utilisateur
            - user.service.ts → Gestion des utilisateurs
            - otp.service.ts → Gestion des OTPs
            - jwt.strategy.ts → Vérification des tokens JWT
            - auth.module.ts → Configuration JWT et Passport
            - auth.service.ts → Validation des identifiants et génération du token
            - jwt-auth.guard.ts → Protection des routes avec JWT
            - auth.controller.ts → Connexion utilisateur
