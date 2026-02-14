const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const axios = require('axios');
const cheerio = require('cheerio');
const { protect, admin } = require('../middleware/authMiddleware.js');
const Document = require('../models/Document.js');

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'text/plain'];
        const ext = path.extname(file.originalname).toLowerCase();
        
        if (allowedTypes.includes(file.mimetype) || ext === '.pdf' || ext === '.txt') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and TXT files are allowed'), false);
        }
    }
});

// Middleware to handle Multer errors
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Max size is 10MB.' });
        }
        return res.status(400).json({ message: err.message });
    } else if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
};

// @desc    Upload document
// @route   POST /api/admin/upload
// @access  Private/Admin
router.post('/upload', protect, admin, (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            return handleMulterError(err, req, res, next);
        }
        next();
    });
}, async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        // Save to DB
        const doc = await Document.create({
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            uploadedBy: req.user._id,
        });

        // Parse PDF/Text
        let text = '';
        if (req.file.mimetype === 'application/pdf') {
            const dataBuffer = fs.readFileSync(req.file.path);
            const data = await pdf(dataBuffer);
            text = data.text;
        } else {
            text = fs.readFileSync(req.file.path, 'utf8');
        }

        // Trigger Python RAG Ingestion
        // Chunking 
        const chunks = text.match(/[\s\S]{1,1000}/g) || [];
        
        // Call Python Service
        const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:5001';
        
        const response = await fetch(`${pythonServiceUrl}/ingest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                documents: chunks,
                ids: chunks.map((_, i) => `${doc._id}_${i}`)
            })
        });

        if (response.ok) {
            doc.status = 'processed';
            await doc.save();
            res.status(201).json({ message: 'File uploaded and processed', doc });
        } else {
            doc.status = 'failed';
            await doc.save();
            res.status(500).json({ message: 'File uploaded but RAG ingestion failed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Scrape website content
// @route   POST /api/admin/scrape
// @access  Private/Admin
router.post('/scrape', protect, admin, async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ message: 'URL is required' });
    }

    try {
        // Create DB record
        const doc = await Document.create({
            filename: url,
            originalName: url,
            path: 'web-content',
            type: 'url',
            uploadedBy: req.user._id,
        });

        // Scrape content
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        const $ = cheerio.load(response.data);
        
        // Remove script and style elements
        $('script, style, nav, footer, header').remove();
        
        const text = $('body').text().replace(/\s+/g, ' ').trim();

        if (!text) {
            doc.status = 'failed';
            await doc.save();
            return res.status(400).json({ message: 'No readable content found at the URL' });
        }

        // Trigger Python RAG Ingestion
        const chunks = text.match(/[\s\S]{1,1000}/g) || [];
        const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:5001';
        
        const ragResponse = await fetch(`${pythonServiceUrl}/ingest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                documents: chunks,
                ids: chunks.map((_, i) => `${doc._id}_${i}`)
            })
        });

        if (ragResponse.ok) {
            doc.status = 'processed';
            await doc.save();
            res.status(201).json({ message: 'Website scraped and processed', doc });
        } else {
            doc.status = 'failed';
            await doc.save();
            res.status(500).json({ message: 'Website scraped but RAG ingestion failed' });
        }
    } catch (error) {
        console.error("Scraping Error:", error.message);
        res.status(500).json({ message: 'Failed to scrape website: ' + error.message });
    }
});

// @desc    Get all documents
// @route   GET /api/admin/documents
// @access  Private/Admin
router.get('/documents', protect, admin, async (req, res) => {
    try {
        const docs = await Document.find({}).populate('uploadedBy', 'username');
        res.json(docs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete document
// @route   DELETE /api/admin/documents/:id
// @access  Private/Admin
router.delete('/documents/:id', protect, admin, async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id);

        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Delete file from filesystem
        if (doc.type === 'file' && fs.existsSync(doc.path)) {
            fs.unlinkSync(doc.path);
        }

        // Remove from DB
        await Document.deleteOne({ _id: doc._id });

        //  Reset RAG for consistency
        try {
             const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:5001';
             await fetch(`${pythonServiceUrl}/reset`, { method: 'POST' });
        } catch (e) {
            console.error("Failed to reset RAG:", e);
        }

        res.json({ message: 'Document removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ═══════════════════  USER MANAGEMENT  ═══════════════════

const User = require('../models/User.js');
const Chat = require('../models/Chat.js');

// @desc    Get all non-admin users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({ isAdmin: false }).select('-password');
        res.json(users);
    } catch (error) {
        console.error('Get Users Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete user and all related data
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', protect, admin, async (req, res) => {
    try {
        const userId = req.params.id;

        // Prevent admin from deleting themselves
        if (userId === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        const userToDelete = await User.findById(userId);
        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent deleting other admins
        if (userToDelete.isAdmin) {
            return res.status(400).json({ message: 'Cannot delete an admin user' });
        }

        // 1. Delete all chat history for this user
        await Chat.deleteMany({ user: userId });

        // 2. Delete all documents uploaded by this user (and their files)
        const userDocs = await Document.find({ uploadedBy: userId });
        for (const doc of userDocs) {
            if (doc.type === 'file' && fs.existsSync(doc.path)) {
                fs.unlinkSync(doc.path);
            }
        }
        await Document.deleteMany({ uploadedBy: userId });

        // 3. Delete the user record
        await User.deleteOne({ _id: userId });

        res.json({ message: 'User and all related data deleted successfully' });
    } catch (error) {
        console.error('Delete User Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
