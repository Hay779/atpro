// --- 1. Importation des outils ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Pour charger les variables d'environnement du fichier .env

// --- 2. Initialisation de l'application Express ---
const app = express();

// --- 3. Configuration des Middlewares ---
app.use(cors()); // Permet les requêtes entre ton frontend et ton backend
app.use(express.json()); // Permet à Express de comprendre le JSON envoyé par le frontend

// --- 4. Connexion à la base de données MongoDB ---
const dbURI = process.env.DATABASE_URL;

mongoose.connect(dbURI)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.error('Erreur de connexion à MongoDB :', err));

// --- 5. Définition des Routes (les "adresses" de ton API) ---

// Route de test pour vérifier que le serveur est en ligne
app.get('/', (req, res) => {
  res.send('Le serveur backend Atelier Express Pro est fonctionnel.');
});

// C'est ici qu'on ajoutera les routes pour les formulaires plus tard
// Exemple de route pour le formulaire de contact (non fonctionnelle pour l'instant)
app.post('/api/contact', (req, res) => {
  console.log('Données du formulaire de contact reçues :', req.body);
  // Ici, on ajoutera la logique pour sauvegarder dans la base de données
  res.status(200).json({ message: 'Message reçu par le serveur.' });
});

// --- 6. Démarrage du serveur ---
const PORT = process.env.PORT || 5000; // Utilise le port de Render, ou 5000 en local

app.listen(PORT, () => {
  console.log(`Serveur démarré et à l'écoute sur le port ${PORT}`);
});