// Fichier : netlify/functions/contact.js
const mongoose = require('mongoose');
require('dotenv').config();

// On ne recrée pas la connexion à chaque fois, on la réutilise si elle existe.
let connection = null;
const dbURI = process.env.DATABASE_URL;

const connectToDatabase = async () => {
  if (connection && mongoose.connection.readyState === 1) {
    return connection;
  }
  connection = await mongoose.connect(dbURI);
  return connection;
};

// Modèle pour le contact (défini directement ici pour la simplicité)
const contactSchema = new mongoose.Schema({
    nom: String, email: String, telephone: String, sujet: String,
    demande_objet: String, message: String, rgpd: Boolean,
    date: { type: Date, default: Date.now }
});
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

// La fonction "handler" est le cœur de la Netlify Function
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    await connectToDatabase();
    const data = JSON.parse(event.body);
    const nouveauContact = new Contact(data);
    await nouveauContact.save();
    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Contact enregistré avec succès.' })
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Erreur lors de l\'enregistrement.', error: error.message })
    };
  }
};