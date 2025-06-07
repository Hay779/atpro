// Fichier : backend/controllers/questionnaireController.js
const QuestionnaireResponse = require('../models/QuestionnaireResponse');

exports.createQuestionnaireResponse = async (req, res) => {
    console.log('Réception d\'une soumission de questionnaire...');
    const nouvelleReponse = new QuestionnaireResponse(req.body);
    try {
        const reponseSauvegardee = await nouvelleReponse.save();
        console.log('Réponse du questionnaire enregistrée :', reponseSauvegardee);
        res.status(201).json({ message: 'Réponse du questionnaire enregistrée avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de la réponse :', error);
        res.status(400).json({ message: 'Erreur lors de l\'enregistrement.', error: error.message });
    }
};