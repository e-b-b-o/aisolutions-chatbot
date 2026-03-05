const Document = require('../models/Document.js');
const axios = require('axios');

const pythonServiceUrl = process.env.RAG_SERVICE_URL || 'http://127.0.0.1:5000';

const generateSummary = async (req, res) => {
    try {
        const doc = await Document.findOne({ _id: req.params.id, uploadedBy: req.user._id });
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        if (doc.status !== 'embedded') {
            return res.status(400).json({ message: 'Document is not fully processed yet' });
        }

        // Return cached summary if exists
        if (doc.summary) {
            return res.json({ summary: doc.summary });
        }

        // Request from Python RAG service
        const response = await axios.post(`${pythonServiceUrl}/generate-summary`, {
            document_id: doc._id.toString()
        }, { timeout: 120000 }); // Generation might take ~1 min

        const summaryText = response.data.summary;
        
        // Cache and save
        doc.summary = summaryText;
        await doc.save();

        res.json({ summary: summaryText });
    } catch (error) {
        console.error("Summary Generation Error:", error.message);
        res.status(500).json({ message: 'Server Error during summary generation' });
    }
};

const generateQuiz = async (req, res) => {
    try {
        const doc = await Document.findOne({ _id: req.params.id, uploadedBy: req.user._id });
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        if (doc.status !== 'embedded') {
            return res.status(400).json({ message: 'Document is not fully processed yet' });
        }

        // Return cached quiz if exists
        if (doc.quiz && doc.quiz.length > 0) {
            return res.json({ quiz: doc.quiz });
        }

        // Request from Python RAG service
        const response = await axios.post(`${pythonServiceUrl}/generate-quiz`, {
            document_id: doc._id.toString()
        }, { timeout: 120000 });

        const quizArray = response.data.quiz;
        
        // Ensure it's an array and valid
        if (!Array.isArray(quizArray) || quizArray.length === 0) {
             return res.status(500).json({ message: 'RAG Service returned malformed quiz JSON' });
        }

        // Cache and save
        doc.quiz = quizArray;
        await doc.save();

        res.json({ quiz: quizArray });
    } catch (error) {
        console.error("Quiz Generation Error:", error.message);
        res.status(500).json({ message: 'Server Error during quiz generation' });
    }
};

const generateFlashcards = async (req, res) => {
    try {
        const doc = await Document.findOne({ _id: req.params.id, uploadedBy: req.user._id });
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        if (doc.status !== 'embedded') {
            return res.status(400).json({ message: 'Document is not fully processed yet' });
        }

        // Return cached flashcards if exists
        if (doc.flashcards && doc.flashcards.length > 0) {
            return res.json({ flashcards: doc.flashcards });
        }

        const response = await axios.post(`${pythonServiceUrl}/generate-flashcards`, {
            document_id: doc._id.toString()
        }, { timeout: 120000 });

        const flashcardsArray = response.data.flashcards;

        if (!Array.isArray(flashcardsArray) || flashcardsArray.length === 0) {
            return res.status(500).json({ message: 'RAG Service returned malformed flashcards' });
        }

        doc.flashcards = flashcardsArray;
        await doc.save();

        res.json({ flashcards: flashcardsArray });
    } catch (error) {
        console.error("Flashcards Generation Error:", error.message);
        res.status(500).json({ message: 'Server Error during flashcards generation' });
    }
};

const generateNotes = async (req, res) => {
    try {
        const doc = await Document.findOne({ _id: req.params.id, uploadedBy: req.user._id });
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        if (doc.status !== 'embedded') {
            return res.status(400).json({ message: 'Document is not fully processed yet' });
        }

        // Return cached notes if exists
        if (doc.notes) {
            return res.json({ notes: doc.notes });
        }

        const response = await axios.post(`${pythonServiceUrl}/generate-notes`, {
            document_id: doc._id.toString()
        }, { timeout: 120000 });

        const notesText = response.data.notes;

        doc.notes = notesText;
        await doc.save();

        res.json({ notes: notesText });
    } catch (error) {
        console.error("Notes Generation Error:", error.message);
        res.status(500).json({ message: 'Server Error during notes generation' });
    }
};

const generateChat = async (req, res) => {
    try {
        const doc = await Document.findOne({ _id: req.params.id, uploadedBy: req.user._id });
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        if (doc.status !== 'embedded') {
            return res.status(400).json({ message: 'Document is not fully processed yet' });
        }

        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        const response = await axios.post(`${pythonServiceUrl}/chat`, {
            document_id: doc._id.toString(),
            message
        }, { timeout: 60000 });

        res.json({ response: response.data.response });
    } catch (error) {
        console.error("Chat Error:", error.message);
        res.status(500).json({ message: 'Server Error during chat' });
    }
};

module.exports = {
    generateSummary,
    generateQuiz,
    generateFlashcards,
    generateNotes,
    generateChat
};
