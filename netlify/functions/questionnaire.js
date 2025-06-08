// Fichier : netlify/functions/questionnaire.js

const mongoose = require('mongoose');
require('dotenv').config();

// Variable pour stocker la connexion et la réutiliser
let connection = null;
const dbURI = process.env.DATABASE_URL;

// Fonction pour établir la connexion à la base de données
const connectToDatabase = async () => {
  if (connection && mongoose.connection.readyState === 1) {
    console.log('Utilisation de la connexion existante à la base de données.');
    return connection;
  }
  console.log('Création d\'une nouvelle connexion à la base de données...');
  connection = await mongoose.connect(dbURI);
  console.log('Nouvelle connexion établie.');
  return connection;
};

// Définition du Modèle Mongoose pour les réponses du questionnaire
const questionnaireSchema = new mongoose.Schema({
    service: String,
    details: mongoose.Schema.Types.Mixed, // Accepte n'importe quel objet pour les détails
    location: String,
    secteur: String,
    email: String,
    nom: String,
    telephone: String,
    date: { type: Date, default: Date.now }
});

// Pour éviter l'erreur de "surcharge de modèle" lors des rechargements à chaud,
// on vérifie si le modèle existe déjà avant de le créer.
const QuestionnaireResponse = mongoose.models.QuestionnaireResponse || mongoose.model('QuestionnaireResponse', questionnaireSchema);

// La fonction handler qui sera exécutée par Netlify
exports.handler = async (event, context) => {
  // On s'assure que la requête est bien de type POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // 1. Connexion à la base de données
    await connectToDatabase();

    // 2. Récupération et parsing des données envoyées par le frontend
    const data = JSON.parse(event.body);
    const nouvelleReponse = new QuestionnaireResponse(data);

    // 3. Sauvegarde des données dans la base
    await nouvelleReponse.save();

    console.log('Réponse du questionnaire enregistrée avec succès.');

    // 4. Envoi d'une réponse de succès au frontend
    return {
      statusCode: 201, // 201 = "Created"
      body: JSON.stringify({ message: 'Réponse du questionnaire enregistrée avec succès.' })
    };
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la réponse du questionnaire :', error);
    
    // 5. Envoi d'une réponse d'erreur au frontend
    return {
      statusCode: 400, // 400 = "Bad Request"
      body: JSON.stringify({ message: 'Erreur lors de l\'enregistrement de la réponse.', error: error.message })
    };
  }
};