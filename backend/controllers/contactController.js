// Fichier : backend/controllers/contactController.js
const Contact = require('../models/Contact');

exports.createContact = async (req, res) => {
    console.log('Réception d\'une soumission de contact...');
    const nouveauContact = new Contact(req.body);
    try {
        const contactSauvegarde = await nouveauContact.save();
        console.log('Contact enregistré :', contactSauvegarde);
        res.status(201).json({ message: 'Contact enregistré avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du contact :', error);
        res.status(400).json({ message: 'Erreur lors de l\'enregistrement.', error: error.message });
    }
};