#                        COMMANDE A EXECUTER DANS LES TERMINALES

CONNEXION A LA BD SUPABASE
    (a revoir)

Exporter bd locale 
    pg_dump -U postgres -d hostolink_bd -F p -f "C:\Users\NGUESSAN.DESKTOP-38E6PIP\Desktop\SohapiGroup\hostolink_back-end\wDev\base_donnees\hostolink_bd_exporter_v1.0004.sql"
    
Importer locale
    psql -U postgres -d hostolink_bd -f "C:\Users\NGUESSAN.DESKTOP-38E6PIP\Desktop\SohapiGroup\hostolink_back-end\base_donnees\hostolink-dev1.sql"


UPLO9ADER UNE IMAGE SUR CLOUDINARY

    curl -X POST "https://api.cloudinary.com/v1_1/dhrrk7vsd/image/upload" -F "file=@C:\Users\NGUESSAN.DESKTOP-38E6PIP\Desktop\SohapiGroup\hostolink_back-end\wDev\prompt.md" -F "upload_preset=hostolink_preset"

    images grouper 
        https://collection.cloudinary.com/dhrrk7vsd/387f34fb0827d86134e0d6d720f22e23
    

INSTALLER DEPENDANCE CLOUDINARY
    npm install @nestjs/platform-express multer multer-storage-cloudinary cloudinary uuid

INSTALLATION CERTIFICAT SUPABASE
    curl -o supabase-ca.pem https://curl.se/ca/cacert.pem

VERIF TABLE DE LA BD supabase
    (a faire)

TEST API supabase
    curl -X GET "https://skwupmsitzsxukbmnkwv.supabase.co/rest/v1/" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrd3VwbXNpdHpzeHVrYm1ua3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMDQ1NzksImV4cCI6MjA1NjU4MDU3OX0.6WDc8hTaer5058Q5RZv4jAdGeJqTwyiLKtnVyXf_a68" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrd3VwbXNpdHpzeHVrYm1ua3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMDQ1NzksImV4cCI6MjA1NjU4MDU3OX0.6WDc8hTaer5058Q5RZv4jAdGeJqTwyiLKtnVyXf_a68"


INSTALLER LES DEPENDANCES ET REBUILDER (supprimer dist)
    npm run build
    npm run buildù

Installer geojson
    npm install geojson
    npm install --save-dev @types/geojson

CONNEXION A LA BD supababse 
    pg_dump -U postgres.skwupmsitzsxukbmnkwv -h aws-0-eu-west-3.pooler.supabase.com -d postgres -f hostolink_bd_supabase.sql

EXPORTER LA BD supababse
    pg_dump -U postgres.skwupmsitzsxukbmnkwv -h aws-0-eu-west-3.pooler.supabase.com -d postgres -f hostolink_bd_supabase.sql


*------------------------------NOTE POUR CREER UNE BASE DE DONNEE POSTGRESQL VIA DOCKER-----------------------------*

Créer une base de données PostgreSQL dans un conteneur Docker est un excellent choix ! Voici les étapes de base pour y parvenir :

*-------------- Télécharger l'image PostgreSQL
    Exécutez la commande suivante pour récupérer l'image officielle de PostgreSQL depuis Docker Hub :
                      docker pull postgres


*-------------- Créer et exécuter un conteneur PostgreSQL
    Lancez un conteneur PostgreSQL en spécifiant un mot de passe pour l'utilisateur postgres :
                            docker run --name nom_de_votre_conteneur -e POSTGRES_PASSWORD=mot_de_passe -d nom_de_votre_bd

*-------------- Se connecter au conteneur
    Vous pouvez accéder au conteneur en exécutant cette commande :
                            docker exec -it nom_de_votre_conteneur bash
    Une fois à l'intérieur du conteneur, vous pouvez accéder à PostgreSQL :
                            psql -U postgres

*-------------- Créer une base de données
    Une fois connecté à PostgreSQL, créez une base de données avec une commande SQL :
                            CREATE DATABASE nom_de_la_base;

Cela devrait vous permettre de configurer et d'utiliser une base PostgreSQL dans votre conteneur Docker. Si vous avez des questions ou rencontrez un problème, je suis là pour vous aider !


*------------------------------NOTE POUR IMPORTER UNE BASE DE DONNEE POSTGRESQL AVEC INSTALLATION DE POSTGIS VIA DOCKER-----------------------------*

    Pour importer une base de données avec PostGIS dans un conteneur Docker, vous pouvez suivre ces étapes :

*------------------------------NOTE POUR LA GEOLOCALISATION -----------------------------*

TELECHARGER POSTGIS 
    https://ftp.postgresql.org/pub/postgis/pg17/v3.5.0/win64/postgis-bundle-pg17x64-setup-3.5.0-2.exe

    executer
    choix  version 
    coche postgis (avant dernière dans la liste)
    executer puis 
    connexion a la bd
    taper la commande d'extension postgis
        > CREATE EXTENSION postgis;
        
    Activer Toutes les Fonctionnalités PostGIS (Optionnel)
        Si tu veux aussi ajouter toutes les fonctionnalités supplémentaires de PostGIS, exécute :
            CREATE EXTENSION postgis_topology; 
            CREATE EXTENSION postgis_raster;
            CREATE EXTENSION postgis_sfcgal; -- Pour la 3D


------------------------- NOTE SECURITE ET CRYPTAGE --------------------

 
# Notes importantes :
    extension pgcrypto pour les criptage sécurisés

        CREATE EXTENSION IF NOT EXISTS pgcrypto;


SUPPRIMER TOUTES LES ADMIN DE LA BD
    TRUNCATE TABLE administrateurs CASCADE;

SUPPRIMER LA CONTRAINT D'ENUM DE role 
    ALTER TABLE administrateurs ALTER COLUMN role TYPE VARCHAR(50);
    
DROP TYPE IF EXISTS role_admin_enum;

<<<<<<< HEAD:Command.MD


------------------------------- MODULE QR CODE --------------------

# Tables modifiés :

    Table compte :

           Column            |            Type             | Collation | Nullable |                  Default
-----------------------------+-----------------------------+-----------+----------+-------------------------------------------
 id_compte                   | integer                     |           | not null | nextval('compte_id_compte_seq'::regclass)
 solde_compte                | integer                     |           |          | 0
 solde_bonus                 | integer                     |           |          | 0
 cumule_mensuel              | integer                     |           |          | 0
 plafond                     | integer                     |           |          | 0
 mode_paiement_preferentiel  | character varying(50)       |           |          |
 type_user                   | character varying(20)       |           | not null |
 devise                      | character varying(10)       |           | not null | 'XOF'::character varying
 numero_compte               | character varying(50)       |           |          |
 date_creation_compte        | timestamp without time zone |           |          | CURRENT_TIMESTAMP
 date_modification           | timestamp without time zone |           |          | CURRENT_TIMESTAMP
 statut                      | character varying(20)       |           |          | 'actif'::character varying
 id_user                     | uuid                        |           |          |
 id_user_etablissement_sante | integer                     |           |          |
Indexes:
    "compte_pkey" PRIMARY KEY, btree (id_compte)
    "compte_numero_compte_key" UNIQUE CONSTRAINT, btree (numero_compte)
Check constraints:
    "compte_type_user_check" CHECK (type_user::text = ANY (ARRAY['utilisateur'::character varying::text, 'etablissement'::character varying::text]))
Foreign-key constraints:
    "fk_compte_user_etablissement_sante" FOREIGN KEY (id_user_etablissement_sante) REFERENCES user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE
    "fk_compte_utilisateur" FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE
Referenced by:
    TABLE "cartes_bancaires" CONSTRAINT "fk_cartes_bancaires_compte" FOREIGN KEY (id_compte) REFERENCES compte(id_compte) ON DELETE CASCADE
    TABLE "transaction_externe" CONSTRAINT "fk_transaction_externe_compte" FOREIGN KEY (id_compte) REFERENCES compte(id_compte) ON DELETE CASCADE
    TABLE "transaction_interne" CONSTRAINT "fk_transaction_interne_expediteur" FOREIGN KEY (id_compte_expediteur) REFERENCES compte(id_compte) ON DELETE CASCADE
    TABLE "transaction_interne" CONSTRAINT "fk_transaction_interne_recepteur" FOREIGN KEY (id_compte_recepteur) REFERENCES compte(id_compte) ON DELETE CASCADE


     Table qr_code_paiement_dynamique :

           Column            |            Type             | Collation | Nullable |                       Default       
-----------------------------+-----------------------------+-----------+----------+-----------------------------------------------------
 id_qrcode                   | integer                     |           | not null | nextval('qr_code_paiement_id_qrcode_seq'::regclass)
 qr_code_valeur              | text                        |           |          |
 date_creation               | timestamp without time zone |           |          | CURRENT_TIMESTAMP
 date_expiration             | timestamp without time zone |           | not null |
 statut                      | character varying(20)       |           |          | 'actif'::character varying
 token                       | character varying(1000)     |           |          | NULL::character varying
 id_user_etablissement_sante | integer                     |           |          |
 id_user                     | uuid                        |           |          |
Indexes:
    "qr_code_paiement_pkey" PRIMARY KEY, btree (id_qrcode)
Foreign-key constraints:
    "fk_qr_code_dynamique_utilisateur" FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE
    "fk_qr_code_paiement_dynamique_user_etablissement_sante" FOREIGN KEY (id_user_etablissement_sante) REFERENCES user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE
    "fk_qr_code_paiement_utilisateur" FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE


    Table qr_code_paiement_statique :

           Column            |            Type             | Collation | Nullable |                           Default   
-----------------------------+-----------------------------+-----------+----------+--------------------------------------------------------------
 id_qrcode                   | integer                     |           | not null | nextval('qr_code_paiement_statique_id_qrcode_seq'::regclass)
 qr_code_data                | text                        |           |          |
 date_creation               | timestamp without time zone |           |          | CURRENT_TIMESTAMP
 statut                      | character varying(20)       |           |          | 'actif'::character varying
 id_user_etablissement_sante | integer                     |           |          |
 id_user                     | uuid                        |           |          |
 date_expiration             | timestamp without time zone |           |          |
 token                       | character varying(1000)     |           |          |
Indexes:
    "qr_code_paiement_statique_pkey" PRIMARY KEY, btree (id_qrcode)
Foreign-key constraints:
    "fk_qr_code_paiement_statique_user_etablissement_sante" FOREIGN KEY (id_user_etablissement_sante) REFERENCES user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE
    "fk_qr_code_utilisateur" FOREIGN KEY (id_user) REFERENCES utilisateur(id_user) ON DELETE CASCADE

DECOMMITER UN FICHIER SUIVI PAR GIT
    placer son nom dans .gitignore
    git rm --cached .env
    git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env' --prune-empty --tag-name-filter cat -- --all
    git push origin --force --all

------------GOOGLE CLOUD ---------------

VOIR L'ETAT DES CES PROJET GOOGLE CLOUD
    https://console.cloud.google.com/iam-admin/projects


---- ENVOI SMS PAR https://account.africastalking.com/ ------

    - atsk_9cb676c636c08f6cad76b4f83d16c7abc61ed8b542f3a7aa43ea08394b7d7444e736c91d 
    - Mb4rrL17e

-------------ENVOI SMS PAR https://dashboard.nexmo.com/ ------------

COMMANDE TEST API https://dashboard.nexmo.com/ 
    curl -X POST "https://rest.nexmo.com/sms/json" -d "api_key=607d95e2" -d "api_secret=2yxhopCqAC9LSxYE" -d "to=+2250502556104" -d "from=Vonage" -d "text=Test OTP de HostoLink"
>>>>>>> 5664c4a69108cd7b4a94b7ada3f9e88d0c32aefc



------------- NOTE ENVOI OTP SMTP -------------
    npm install nodemailer axios
    npm install nodemailer
    node test_email.js



------------ NOTE NOTIFICATION PUSH FIREBASE ------------

CREER UNE CLE PRIVE,TELECHARGER ,RENOME ,PLACER DANS 
    /config
    ajouter FIREBASE_CREDENTIALS=config/firebase-admin-sdk.json dans .env

INSTALLER LA DEPENDANCE POUR ENVOI 
    npm install firebase-admin

CREER firebase.service.ts DANS config/ 
    et ajouter son code
    on ajouter son module dans app.module
    lancer le server 

------------------- SMS NOTE NONAGE --------------

CREER SON COMPTE 
VERIFIER PAR WHATSAPP 
RECUP API CLE ET ID 
INSTALLER LA DPCE 
    npm install @vonage/server-sdk

AJOUTER CES VR DS l'ENVIRON 



----------------------------- SQL SUPABASE -----------------

VOIR TOUTES LES LIAISONS DES TABLES 
    SELECT 
        tc.table_name AS table_name,
        kcu.column_name AS column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        rc.update_rule AS on_update,
        rc.delete_rule AS on_delete
    FROM 
        information_schema.table_constraints AS tc 
    JOIN 
        information_schema.key_column_usage AS kcu 
        ON tc.constraint_name = kcu.constraint_name
    JOIN 
        information_schema.referential_constraints AS rc 
        ON tc.constraint_name = rc.constraint_name
    JOIN 
        information_schema.constraint_column_usage AS ccu 
        ON rc.unique_constraint_name = ccu.constraint_name
    WHERE 
        tc.constraint_type = 'FOREIGN KEY'
    ORDER BY 
        tc.table_name, kcu.column_name;