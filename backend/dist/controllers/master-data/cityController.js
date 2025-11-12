"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleCityStatus = exports.deleteCity = exports.updateCity = exports.createCity = exports.getCityById = exports.getCities = void 0;
const City_1 = __importDefault(require("../../models/master-data/City"));
const getCities = async (req, res) => {
    try {
        const { includeInactive, state } = req.query;
        let filter = {};
        if (includeInactive !== 'true') {
            filter.isActive = true;
        }
        if (state) {
            filter.state = state;
        }
        const cities = await City_1.default.find(filter).sort({ displayOrder: 1, value: 1 });
        console.log(`📋 Retrieved ${cities.length} cities`);
        return res.json({
            success: true,
            data: cities
        });
    }
    catch (error) {
        console.error('❌ Error fetching cities:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch cities'
        });
    }
};
exports.getCities = getCities;
const getCityById = async (req, res) => {
    try {
        const { id } = req.params;
        const city = await City_1.default.findById(id);
        if (!city) {
            return res.status(404).json({
                success: false,
                message: 'City not found'
            });
        }
        return res.json({
            success: true,
            data: city
        });
    }
    catch (error) {
        console.error('❌ Error fetching city:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch city'
        });
    }
};
exports.getCityById = getCityById;
const createCity = async (req, res) => {
    try {
        const { key, value, description, displayOrder, isActive, state, country } = req.body;
        const existingCity = await City_1.default.findOne({ key: key.toLowerCase() });
        if (existingCity) {
            return res.status(400).json({
                success: false,
                message: 'City with this key already exists'
            });
        }
        const city = await City_1.default.create({
            key: key.toLowerCase(),
            value,
            description,
            displayOrder: displayOrder || 0,
            isActive: isActive !== undefined ? isActive : true,
            state: state.toLowerCase(),
            country: country || 'india'
        });
        console.log(`✅ Created city: ${city.value}`);
        return res.status(201).json({
            success: true,
            message: 'City created successfully',
            data: city
        });
    }
    catch (error) {
        console.error('❌ Error creating city:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create city'
        });
    }
};
exports.createCity = createCity;
const updateCity = async (req, res) => {
    try {
        const { id } = req.params;
        const { key, value, description, displayOrder, isActive, state, country } = req.body;
        const city = await City_1.default.findByIdAndUpdate(id, {
            key: key?.toLowerCase(),
            value,
            description,
            displayOrder,
            isActive,
            state: state?.toLowerCase(),
            country,
            updatedAt: new Date()
        }, { new: true, runValidators: true });
        if (!city) {
            return res.status(404).json({
                success: false,
                message: 'City not found'
            });
        }
        console.log(`✅ Updated city: ${city.value}`);
        return res.json({
            success: true,
            message: 'City updated successfully',
            data: city
        });
    }
    catch (error) {
        console.error('❌ Error updating city:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update city'
        });
    }
};
exports.updateCity = updateCity;
const deleteCity = async (req, res) => {
    try {
        const { id } = req.params;
        const city = await City_1.default.findByIdAndDelete(id);
        if (!city) {
            return res.status(404).json({
                success: false,
                message: 'City not found'
            });
        }
        console.log(`🗑️  Deleted city: ${city.value}`);
        return res.json({
            success: true,
            message: 'City deleted successfully'
        });
    }
    catch (error) {
        console.error('❌ Error deleting city:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete city'
        });
    }
};
exports.deleteCity = deleteCity;
const toggleCityStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const city = await City_1.default.findById(id);
        if (!city) {
            return res.status(404).json({
                success: false,
                message: 'City not found'
            });
        }
        city.isActive = !city.isActive;
        await city.save();
        console.log(`🔄 Toggled city status: ${city.value} - ${city.isActive ? 'Active' : 'Inactive'}`);
        return res.json({
            success: true,
            message: `City ${city.isActive ? 'activated' : 'deactivated'} successfully`,
            data: city
        });
    }
    catch (error) {
        console.error('❌ Error toggling city status:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to toggle city status'
        });
    }
};
exports.toggleCityStatus = toggleCityStatus;
//# sourceMappingURL=cityController.js.map