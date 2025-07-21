const Service = require('../models/Service');

// Create a new service
const createService = async (req, res) => {
    try {
        const { title, description, price } = req.body;

        if (!title || !description || price === undefined) {
            return res.status(400).json({ message: '❌ All fields are required' });
        }

        const newService = new Service({ title, description, price });
        await newService.save();
        res.status(201).json(newService);
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to create service', error: error.message });
    }
};

// Get all services
const getServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to fetch services', error: error.message });
    }
};

// Update service
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price } = req.body;

        const service = await Service.findById(id);
        if (!service) return res.status(404).json({ message: '❌ Service not found' });

        service.title = title || service.title;
        service.description = description || service.description;
        service.price = price !== undefined ? price : service.price;

        const updatedService = await service.save();
        res.status(200).json({ message: '✅ Service updated successfully', updatedService });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to update service', error: error.message });
    }
};

// Delete service
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findById(id);
        if (!service) return res.status(404).json({ message: '❌ Service not found' });

        await service.deleteOne();
        res.status(200).json({ message: '✅ Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to delete service', error: error.message });
    }
};

module.exports = {
    createService,
    getServices,
    updateService,
    deleteService
};
