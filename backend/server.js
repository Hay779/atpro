// Fichier : backend/server.js

// --- 1. Importation des outils ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// --- 2. Initialisation de l'application Express ---
const app = express();

// --- 3. Configuration des Middlewares ---
app.use(cors()); // Permet les requêtes entre ton frontend et ton backend
app.use(express.json()); // Permet à Express de comprendre le JSON envoyé

// --- 4. Connexion à la base de données MongoDB ---
const dbURI = process.env.DATABASE_URL;

if (!dbURI) {
    console.error("Erreur: La variable d'environnement DATABASE_URL n'est pas définie.");
    process.exit(1); // Arrête l'application si la clé de la DB est manquante
}

mongoose.connect(dbURI)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.error('Erreur de connexion à MongoDB :', err));

// --- 5. Définition des Modèles (la structure de nos données) ---

// Modèle pour le formulaire de contact
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
const Contact = mongoose.model('Contact', contactSchema);

// Modèle pour les réponses du questionnaire
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
const QuestionnaireResponse = mongoose.model('QuestionnaireResponse', questionnaireSchema);


// --- 6. Définition des Routes (les "adresses" de notre API) ---

// Route de test
app.get('/', (req, res) => {
  res.send('Le serveur backend Atelier Express Pro est fonctionnel.');
});

// Route pour enregistrer un nouveau contact
app.post('/api/contact', async (req, res) => {
  console.log('Réception d\'une soumission de contact...');
  const nouveauContact = new Contact(req.body);
  try {
    const contactSauvegarde = await nouveauContact.save();
    console.log('Contact enregistré avec succès :', contactSauvegarde);
    res.status(201).json({ message: 'Contact enregistré avec succès.' });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du contact :', error);
    res.status(400).json({ message: 'Erreur lors de l\'enregistrement du contact.', error: error.message });
  }
});

// Route pour enregistrer une réponse du questionnaire
app.post('/api/questionnaire', async (req, res) => {
  console.log('Réception d\'une soumission de questionnaire...');
  const nouvelleReponse = new QuestionnaireResponse(req.body);
  try {
    const reponseSauvegardee = await nouvelleReponse.save();
    console.log('Réponse du questionnaire enregistrée avec succès :', reponseSauvegardee);
    res.status(201).json({ message: 'Réponse du questionnaire enregistrée avec succès.' });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la réponse :', error);
    res.status(400).json({ message: 'Erreur lors de l\'enregistrement de la réponse.', error: error.message });
  }
});

// --- 7. Démarrage du serveur ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré et à l'écoute sur le port ${PORT}`);
});