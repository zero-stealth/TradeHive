const serviceModel = require('../models/Service')
const authModel = require('../models/Auth')
const asyncHandler = require('express-async-handler')

//create new service
const createService = asyncHandler(async (req, res) => {
    const { name, description, price, duration, provider, category } = req.body
    if(!name || !description || !price || !duration || !provider || !category) {
        res.status(400)
        throw new Error("Please enter all required fields")
    }
    const service = await serviceModel.create({
        name, description, price, duration, provider, category, user: req.user.id
    })
    if(service){
        res.status(201).json({
            _id: service.id,
            name: service.name,
            description: service.description,
            duration: service.duration,
            provider: service.provider,
            category: service.category
        })
    } else {
        res.status(400).json({error: "An error occurred"})
    }
})

//update a service
const updateService = asyncHandler( async( req, res ) => {
    const service = await serviceModel.findById(req.params.id);

    if(!service) {
        res.status(404);
        throw new Error("Service not found");  
    };

    const user = await authModel.findById(req.user.id);

    if(!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const updatedService = await serviceModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedService);
});

//delete service
const deleteService = asyncHandler( async( req, res ) => {
    const service = await serviceModel.findById(req.params.id);
    if(!service) {
        res.status(404);
        throw new Error("Service not found ");
    }

    const user = await authModel.findById(req.user.id);

    if(!user) {
        res.status(404);
        throw new Error("User not found")
    }

    await service.remove();
    res.status(200).json({ id: req.params.id })
});

//get single servive
const getService = asyncHandler(async (req, res) => {
    const service = await serviceModel.findById(req.params.id)
    if(!service) {
        res.status(400)
        throw new Error("Service not found")
    } else {
        res.status(201).json(service)
    }
})

//get all services by one freelancer
const getAllServices = asyncHandler(async (req, res) => {
    const services = await serviceModel.find()
    if (!services) {
        res.status(400)
        throw new Error("You have not added any services")
    } else {
        res.status(200).json(services)
    }
})


module.exports = {
    createService,
    updateService,
    deleteService,
    getService,
    getAllServices
}