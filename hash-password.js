// hash-password.js

const bcrypt = require('bcrypt');

// Récupérer le mot de passe depuis la ligne de commande
const motDePasse = process.argv[2];

if (!motDePasse) {
  console.error("❌ Veuillez fournir un mot de passe en argument.");
  process.exit(1);
}

// Générer le hash
const saltRounds = 10;
const hash = bcrypt.hashSync(motDePasse, saltRounds);

// Afficher le résultat
//console.log("✅ Hash généré pour le mot de passe :", motDePasse);
//console.log("🔐 Hash :", hash);
