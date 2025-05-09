const express = require('express');
const router = express.Router();

// GET all users
router.get('/', (req, res) => {
    res.status(200).json({ message: 'Get all users endpoint' });
});

// GET user by ID
router.get('/:id', (req, res) => {
    res.status(200).json({ message: `Get user with ID ${req.params.id}` });
});

// POST create new user
router.post('/', (req, res) => {
    res.status(201).json({ message: 'Create new user endpoint', data: req.body });
});

// PUT update user
router.put('/:id', (req, res) => {
    res.status(200).json({ message: `Update user with ID ${req.params.id}`, data: req.body });
});

// DELETE user
router.delete('/:id', (req, res) => {
    res.status(200).json({ message: `Delete user with ID ${req.params.id}` });
});

module.exports = router;