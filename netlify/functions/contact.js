// Fichier : netlify/functions/contact.js

// On importe les outils nécessaires
const mongoose = require('mongoose');
// On charge les variables d'environnement (comme DATABASE_URL)
require('dotenv').config();

// On garde la connexion en mémoire pour la réutiliser et être plus rapide
let connection = null;
const dbURI = process.env.DATABASE_URL;

// Fonction pour se connecter à la base de données
const connectToDatabase = async () => {
  if (connection && mongoose.connection.readyState === 1) {
    return; // Si déjà connecté, on ne fait rien
  }
  console.log('Nouvelle connexion à MongoDB pour "contact"...');
  connection = await mongoose.connect(dbURI);
  console.log('Connexion réussie pour "contact" !');
};

// On définit la structure (le "schéma") d'un document de contact
const contactSchema = new mongoose.Schema({
    nom: String,
    email: String,
    telephone: String,
    sujet: String,
    demande_objet: String,
    message: String,
    rgpd: Boolean,
    date: { type: Date, default: Date.now }
});

// On crée le "Modèle" qui nous permettra d'interagir avec la collection "contacts"
// L'astuce "mongoose.models.Contact ||" évite les erreurs en développement
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

// C'est la fonction principale que Netlify va exécuter
exports.handler = async (event) => {
  // On vérifie que la requête est bien de type POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // 1. Connexion à la base de données
    await connectToDatabase();

    // 2. Récupération des données envoyées par le formulaire
    const data = JSON.parse(event.body);
    const nouveauContact = new Contact(data);

    // 3. Sauvegarde dans la base de données
    await nouveauContact.save();

    // 4. On renvoie une réponse de succès
    return {
      statusCode: 201, // 201 = "Créé avec succès"
      body: JSON.stringify({ message: 'Contact enregistré avec succès.' })
    };
  } catch (error) {
    // 5. En cas d'erreur, on la logue et on renvoie une réponse d'erreur
    console.error('Erreur dans la fonction contact:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Erreur lors de l\'enregistrement du contact.', error: error.message })
    };
  }
};