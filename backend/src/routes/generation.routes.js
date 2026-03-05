const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware.js');
const { 
    generateSummary, 
    generateQuiz,
    generateFlashcards,
    generateNotes,
    generateChat
} = require('../controllers/generation.controller.js');

router.post('/summary/:id', protect, generateSummary);
router.post('/quiz/:id', protect, generateQuiz);
router.post('/flashcards/:id', protect, generateFlashcards);
router.post('/notes/:id', protect, generateNotes);
router.post('/chat/:id', protect, generateChat);

module.exports = router;
