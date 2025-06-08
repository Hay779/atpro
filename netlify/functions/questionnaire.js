// Fichier : netlify/functions/questionnaire.js

const mongoose = require('mongoose');
require('dotenv').config();

let connection = null;
const dbURI = process.env.DATABASE_URL;

const connectToDatabase = async () => {
  if (connection && mongoose.connection.readyState === 1) {
    return;
  }
  console.log('Nouvelle connexion à MongoDB pour "questionnaire"...');
  connection = await mongoose.connect(dbURI);
  console.log('Connexion réussie pour "questionnaire" !');
};

// On définit la structure d'une réponse de questionnaire
const questionnaireSchema = new mongoose.Schema({
    service: String,
    details: mongoose.Schema.Types.Mixed, // 'Mixed' accepte n'importe quel type d'objet
    location: String,
    secteur: String,
    email: String,
    nom: String,
    telephone: String,
    date: { type: Date, default: Date.now }
});

const QuestionnaireResponse = mongoose.models.QuestionnaireResponse || mongoose.model('QuestionnaireResponse', questionnaireSchema);

// La fonction principale que Netlify va exécuter
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    await connectToDatabase();
    const data = JSON.parse(event.body);
    const nouvelleReponse = new QuestionnaireResponse(data);
    await nouvelleReponse.save();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Réponse du questionnaire enregistrée avec succès.' })
    };
  } catch (error) {
    console.error('Erreur dans la fonction questionnaire:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Erreur lors de l\'enregistrement de la réponse.', error: error.message })
    };
  }
};