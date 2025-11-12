"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkCreateMasterData = exports.toggleMasterDataStatus = exports.deleteMasterData = exports.updateMasterData = exports.createMasterData = exports.getAllCategories = exports.getMasterDataByCategory = void 0;
const MasterData_1 = require("../models/MasterData");
const getMasterDataByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const { includeInactive } = req.query;
        const query = { category };
        if (!includeInactive || includeInactive === 'false') {
            query.isActive = true;
        }
        const data = await MasterData_1.MasterData.find(query)
            .sort({ displayOrder: 1, value: 1 });
        console.log(`📋 Retrieved ${data.length} items for category: ${category}`);
        return res.json({
            success: true,
            data: {
                category,
                items: data,
            },
        });
    }
    catch (error) {
        console.error('Get master data by category error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
exports.getMasterDataByCategory = getMasterDataByCategory;
const getAllCategories = async (req, res) => {
    try {
        const categories = await MasterData_1.MasterData.distinct('category');
        return res.json({
            success: true,
            data: { categories },
        });
    }
    catch (error) {
        console.error('Get all categories error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
exports.getAllCategories = getAllCategories;
const createMasterData = async (req, res) => {
    try {
        const { category, key, value, description, displayOrder, metadata } = req.body;
        const existing = await MasterData_1.MasterData.findOne({ category, key });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Master data item with this key already exists in this category',
            });
        }
        const masterData = new MasterData_1.MasterData({
            category,
            key: key.toLowerCase(),
            value,
            description,
            displayOrder,
            metadata,
            createdBy: req.body.createdBy,
        });
        await masterData.save();
        console.log(`✅ Created master data: ${category}/${key}`);
        return res.status(201).json({
            success: true,
            data: { masterData },
            message: 'Master data created successfully',
        });
    }
    catch (error) {
        console.error('Create master data error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
exports.createMasterData = createMasterData;
const updateMasterData = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const masterData = await MasterData_1.MasterData.findByIdAndUpdate(id, {
            ...updateData,
            updatedBy: req.body.updatedBy,
        }, { new: true, runValidators: true });
        if (!masterData) {
            return res.status(404).json({
                success: false,
                message: 'Master data not found',
            });
        }
        console.log(`✅ Updated master data: ${masterData.category}/${masterData.key}`);
        return res.json({
            success: true,
            data: { masterData },
            message: 'Master data updated successfully',
        });
    }
    catch (error) {
        console.error('Update master data error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
exports.updateMasterData = updateMasterData;
const deleteMasterData = async (req, res) => {
    try {
        const { id } = req.params;
        const masterData = await MasterData_1.MasterData.findByIdAndDelete(id);
        if (!masterData) {
            return res.status(404).json({
                success: false,
                message: 'Master data not found',
            });
        }
        console.log(`🗑️ Deleted master data: ${masterData.category}/${masterData.key}`);
        return res.json({
            success: true,
            message: 'Master data deleted successfully',
        });
    }
    catch (error) {
        console.error('Delete master data error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
exports.deleteMasterData = deleteMasterData;
const toggleMasterDataStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const masterData = await MasterData_1.MasterData.findById(id);
        if (!masterData) {
            return res.status(404).json({
                success: false,
                message: 'Master data not found',
            });
        }
        masterData.isActive = !masterData.isActive;
        await masterData.save();
        console.log(`🔄 Toggled master data status: ${masterData.category}/${masterData.key} -> ${masterData.isActive}`);
        return res.json({
            success: true,
            data: { masterData },
            message: `Master data ${masterData.isActive ? 'activated' : 'deactivated'} successfully`,
        });
    }
    catch (error) {
        console.error('Toggle master data status error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
exports.toggleMasterDataStatus = toggleMasterDataStatus;
const bulkCreateMasterData = async (req, res) => {
    try {
        const { items } = req.body;
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Items array is required',
            });
        }
        const createdItems = await MasterData_1.MasterData.insertMany(items, { ordered: false });
        console.log(`✅ Bulk created ${createdItems.length} master data items`);
        return res.status(201).json({
            success: true,
            data: { items: createdItems, count: createdItems.length },
            message: 'Master data items created successfully',
        });
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Some items already exist',
                details: error.writeErrors || [],
            });
        }
        console.error('Bulk create master data error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
exports.bulkCreateMasterData = bulkCreateMasterData;
//# sourceMappingURL=masterDataController.js.map