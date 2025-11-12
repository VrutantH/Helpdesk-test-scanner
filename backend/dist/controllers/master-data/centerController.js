"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleCenterStatus = exports.deleteCenter = exports.updateCenter = exports.createCenter = exports.getCenterById = exports.getCenters = void 0;
const Center_1 = __importDefault(require("../../models/master-data/Center"));
const getCenters = async (req, res) => {
    try {
        const { includeInactive, city, state } = req.query;
        let filter = {};
        if (includeInactive !== 'true') {
            filter.isActive = true;
        }
        if (city) {
            filter.city = city;
        }
        if (state) {
            filter.state = state;
        }
        const centers = await Center_1.default.find(filter).sort({ displayOrder: 1, value: 1 });
        console.log(`📋 Retrieved ${centers.length} centers`);
        return res.json({
            success: true,
            data: centers
        });
    }
    catch (error) {
        console.error('❌ Error fetching centers:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch centers'
        });
    }
};
exports.getCenters = getCenters;
const getCenterById = async (req, res) => {
    try {
        const { id } = req.params;
        const center = await Center_1.default.findById(id);
        if (!center) {
            return res.status(404).json({
                success: false,
                message: 'Center not found'
            });
        }
        return res.json({
            success: true,
            data: center
        });
    }
    catch (error) {
        console.error('❌ Error fetching center:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch center'
        });
    }
};
exports.getCenterById = getCenterById;
const createCenter = async (req, res) => {
    try {
        const { key, value, description, displayOrder, isActive, address, city, state, zipcode, timing, googleMapLink, phone, email } = req.body;
        const existingCenter = await Center_1.default.findOne({ key: key.toLowerCase() });
        if (existingCenter) {
            return res.status(400).json({
                success: false,
                message: 'Center with this key already exists'
            });
        }
        const center = await Center_1.default.create({
            key: key.toLowerCase(),
            value,
            description,
            displayOrder: displayOrder || 0,
            isActive: isActive !== undefined ? isActive : true,
            address,
            city: city.toLowerCase(),
            state: state.toLowerCase(),
            zipcode,
            timing,
            googleMapLink,
            phone,
            email: email?.toLowerCase()
        });
        console.log(`✅ Created center: ${center.value}`);
        return res.status(201).json({
            success: true,
            message: 'Center created successfully',
            data: center
        });
    }
    catch (error) {
        console.error('❌ Error creating center:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create center'
        });
    }
};
exports.createCenter = createCenter;
const updateCenter = async (req, res) => {
    try {
        const { id } = req.params;
        const { key, value, description, displayOrder, isActive, address, city, state, zipcode, timing, googleMapLink, phone, email } = req.body;
        const center = await Center_1.default.findByIdAndUpdate(id, {
            key: key?.toLowerCase(),
            value,
            description,
            displayOrder,
            isActive,
            address,
            city: city?.toLowerCase(),
            state: state?.toLowerCase(),
            zipcode,
            timing,
            googleMapLink,
            phone,
            email: email?.toLowerCase(),
            updatedAt: new Date()
        }, { new: true, runValidators: true });
        if (!center) {
            return res.status(404).json({
                success: false,
                message: 'Center not found'
            });
        }
        console.log(`✅ Updated center: ${center.value}`);
        return res.json({
            success: true,
            message: 'Center updated successfully',
            data: center
        });
    }
    catch (error) {
        console.error('❌ Error updating center:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update center'
        });
    }
};
exports.updateCenter = updateCenter;
const deleteCenter = async (req, res) => {
    try {
        const { id } = req.params;
        const center = await Center_1.default.findByIdAndDelete(id);
        if (!center) {
            return res.status(404).json({
                success: false,
                message: 'Center not found'
            });
        }
        console.log(`🗑️  Deleted center: ${center.value}`);
        return res.json({
            success: true,
            message: 'Center deleted successfully'
        });
    }
    catch (error) {
        console.error('❌ Error deleting center:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete center'
        });
    }
};
exports.deleteCenter = deleteCenter;
const toggleCenterStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const center = await Center_1.default.findById(id);
        if (!center) {
            return res.status(404).json({
                success: false,
                message: 'Center not found'
            });
        }
        center.isActive = !center.isActive;
        await center.save();
        console.log(`🔄 Toggled center status: ${center.value} - ${center.isActive ? 'Active' : 'Inactive'}`);
        return res.json({
            success: true,
            message: `Center ${center.isActive ? 'activated' : 'deactivated'} successfully`,
            data: center
        });
    }
    catch (error) {
        console.error('❌ Error toggling center status:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to toggle center status'
        });
    }
};
exports.toggleCenterStatus = toggleCenterStatus;
//# sourceMappingURL=centerController.js.map