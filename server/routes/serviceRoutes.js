const express = require('express');
const router = express.Router();

const {
    createService,
    getServices,
    updateService,
    deleteService
} = require('../controllers/serviceController');

// Get all services
router.get('/', getServices);

// Add a new service
router.post('/', createService);

// Update a service
router.put('/:id', updateService);

// Delete a service
router.delete('/:id', deleteService);

module.exports = router;
