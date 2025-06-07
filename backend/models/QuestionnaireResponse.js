// Fichier : backend/models/QuestionnaireResponse.js
const mongoose = require('mongoose');

const questionnaireSchema = new mongoose.Schema({
    service: String,
    details: mongoose.Schema.Types.Mixed,
    location: String,
    secteur: String,
    email: String,
    nom: String,
    telephone: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuestionnaireResponse', questionnaireSchema);