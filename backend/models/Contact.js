// Fichier : backend/models/Contact.js
const mongoose = require('mongoose');

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

module.exports = mongoose.model('Contact', contactSchema);