- je developpe une application flutter de payement  inluant un reseau sociale , un systeme de géolocalisation des  établissement de santé , 
    de discution sur des thématique , de listing des etablissement de santé et numero d'urgence avec 
    leur information puis on peut cliquer sur leur numero et etre rediriger sur l'application d'appel , 
    incluant une carte bancaire, son qr code lui permet de recevoir de l'argent et en le scannant par la même application , 
    deposer et retirer de l'argent de l'application a travers les operateur mobile ivoirienne ainsi que wave, banque, 
    djamo; le principe de l'application est quel'utilisateur a le choix de saisir son numéro ou son adresse email 
    et quand il saisir , si ces coordonnée n'existe pas dans la base de données postgres alors on insert dans 
    la bd puis on lui demande definir un mot de passe puis de le taper a noueau si les deux mot de passe correspond 
    alors on insert dans la bd puis il a accès au dashord pour la suite voici la base de donnée en question j'aimerais 
    que tu merise car nous allons l'utilser tout au long du projet 

    front-end : Flutter 
    back-end : postgres 
    back-end : netjs 
    environnement de test avant de l'introduit dans le flutter déjà développer :postman

    hebergeur d'images : cloudinary
    hebergeur bd : supabase
    hebergeur back-end : render

-------------ENDPOINT DEV FONCTIONNELLES -----------

    ok - 1- MISSION : Vérifier si un utilisateur existe
    Méthode : POST
    URL : http://localhost:3000/api/check-user
    BODY 
        {
        "identifier": "testemail@gmail.com"
        }

    
    ok - 2- MISSION : Enregistrer un utilisateur (Sans mot de passe)
    Méthode : POST
    URL : http://localhost:3000/api/register-user
    BODY 
        {
        "identifier": "testemail@gmail.com"
        }

    
    ok - 3-MISSION : Définir un mot de passe après inscription
    Méthode : POST
    URL :http://localhost:3000/api/define-password
    BODY 
        {
        "identifier": "testemail@gmail.com",
        "password": "MonMotDePasse123"
        }

    ok - 4-MISSION : Générer un OTP
    Méthode : POST
    URL : http://localhost:3000/api/generate-otp
    BODY 
        {
        "identifier": "testemail@gmail.com"
        }


    ok - 5-MISSION :  Vérifier un OTP
    Méthode : POST
    URL : http://localhost:3000/api/verify-otp
    BODY 
        {
        "identifier": "testemail@gmail.com",
        "otpCode": "123456"
        }



    ok - 6-MISSION :   Vérifier le PIN (mot de passe)
    Méthode : POST
    URL : http://localhost:3000/api/verify-pin
    BODY 
        {
        "identifier": "testemail@gmail.com",
        "otpCode": "123456"
        }
    
    ok -7-MISSION :Récupérer tous les utilisateurs (Test Admin uniquement)
    Méthode : POST
    URL : http://localhost:3000/api/verify-pin
    BODY 
        {
        "identifier": "testemail@gmail.com",
        "otpCode": "123456"
        }

    
-------------.env  -------------



-------------CLOUDINARY-------------
API Secret 
        HEEz2vCv7MyxBRjCZScbXeUKgEw

API KEY 
        197881586145143

API environment variable 
        CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@dhrrk7vsd



----------SUPABASE--------------

projet name
    hostolink
mdp
    mdp_dev_sohapigroup

Session pooler Supavisor
    Url : postgresql://postgres.skwupmsitzsxukbmnkwv:[YOUR-PASSWORD]@aws-0-eu-west-3.pooler.supabase.com:5432/postgres

    host: aws-0-eu-west-3.pooler.supabase.com

    port: 5432

    database: postgres

    user: postgres

