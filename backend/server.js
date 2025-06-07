// Fichier : backend/server.js (VERSION REFACTORISÉE)

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Importer les fichiers de routes
const contactRoutes = require('./routes/contactRoutes');
const questionnaireRoutes = require('./routes/questionnaireRoutes');

const app = express();

// Configuration des Middlewares
const corsOptions = {
    origin: 'https://atpro-site.onrender.com', // L'URL de ton frontend
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Connexion à la base de données
const dbURI = process.env.DATABASE_URL;
mongoose.connect(dbURI)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.error('Erreur de connexion à MongoDB :', err));

// Utilisation des Routes
app.get('/', (req, res) => {
    res.send('Le serveur backend Atelier Express Pro est fonctionnel.');
});
app.use('/api/contact', contactRoutes);
app.use('/api/questionnaire', questionnaireRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré et à l'écoute sur le port ${PORT}`);
});