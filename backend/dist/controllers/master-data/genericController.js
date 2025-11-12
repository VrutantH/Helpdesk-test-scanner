"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.languageController = exports.dateFormatController = exports.timezoneController = exports.currencyController = exports.countryController = exports.organizationController = exports.industryController = exports.organizationTypeController = void 0;
const master_data_1 = require("../../models/master-data");
const createGenericController = (Model, name) => {
    return {
        getAll: async (req, res) => {
            try {
                const { includeInactive } = req.query;
                const filter = includeInactive === 'true' ? {} : { isActive: true };
                const items = await Model.find(filter).sort({ displayOrder: 1, value: 1 });
                console.log(`📋 Retrieved ${items.length} ${name}`);
                return res.json({
                    success: true,
                    data: items
                });
            }
            catch (error) {
                console.error(`❌ Error fetching ${name}:`, error);
                return res.status(500).json({
                    success: false,
                    message: `Failed to fetch ${name}`
                });
            }
        },
        getById: async (req, res) => {
            try {
                const { id } = req.params;
                const item = await Model.findById(id);
                if (!item) {
                    return res.status(404).json({
                        success: false,
                        message: `${name} not found`
                    });
                }
                return res.json({
                    success: true,
                    data: item
                });
            }
            catch (error) {
                console.error(`❌ Error fetching ${name}:`, error);
                return res.status(500).json({
                    success: false,
                    message: `Failed to fetch ${name}`
                });
            }
        },
        create: async (req, res) => {
            try {
                const { key, ...otherFields } = req.body;
                const existingItem = await Model.findOne({ key: key.toLowerCase() });
                if (existingItem) {
                    return res.status(400).json({
                        success: false,
                        message: `${name} with this key already exists`
                    });
                }
                const item = await Model.create({
                    key: key.toLowerCase(),
                    ...otherFields,
                    displayOrder: otherFields.displayOrder || 0,
                    isActive: otherFields.isActive !== undefined ? otherFields.isActive : true
                });
                console.log(`✅ Created ${name}: ${item.value}`);
                return res.status(201).json({
                    success: true,
                    message: `${name} created successfully`,
                    data: item
                });
            }
            catch (error) {
                console.error(`❌ Error creating ${name}:`, error);
                return res.status(500).json({
                    success: false,
                    message: `Failed to create ${name}`
                });
            }
        },
        update: async (req, res) => {
            try {
                const { id } = req.params;
                const { key, ...otherFields } = req.body;
                const updateData = {
                    ...otherFields,
                    updatedAt: new Date()
                };
                if (key) {
                    updateData.key = key.toLowerCase();
                }
                const item = await Model.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
                if (!item) {
                    return res.status(404).json({
                        success: false,
                        message: `${name} not found`
                    });
                }
                console.log(`✅ Updated ${name}: ${item.value}`);
                return res.json({
                    success: true,
                    message: `${name} updated successfully`,
                    data: item
                });
            }
            catch (error) {
                console.error(`❌ Error updating ${name}:`, error);
                return res.status(500).json({
                    success: false,
                    message: `Failed to update ${name}`
                });
            }
        },
        delete: async (req, res) => {
            try {
                const { id } = req.params;
                const item = await Model.findByIdAndDelete(id);
                if (!item) {
                    return res.status(404).json({
                        success: false,
                        message: `${name} not found`
                    });
                }
                console.log(`🗑️  Deleted ${name}: ${item.value}`);
                return res.json({
                    success: true,
                    message: `${name} deleted successfully`
                });
            }
            catch (error) {
                console.error(`❌ Error deleting ${name}:`, error);
                return res.status(500).json({
                    success: false,
                    message: `Failed to delete ${name}`
                });
            }
        },
        toggleStatus: async (req, res) => {
            try {
                const { id } = req.params;
                const item = await Model.findById(id);
                if (!item) {
                    return res.status(404).json({
                        success: false,
                        message: `${name} not found`
                    });
                }
                item.isActive = !item.isActive;
                await item.save();
                console.log(`🔄 Toggled ${name} status: ${item.value} - ${item.isActive ? 'Active' : 'Inactive'}`);
                return res.json({
                    success: true,
                    message: `${name} ${item.isActive ? 'activated' : 'deactivated'} successfully`,
                    data: item
                });
            }
            catch (error) {
                console.error(`❌ Error toggling ${name} status:`, error);
                return res.status(500).json({
                    success: false,
                    message: `Failed to toggle ${name} status`
                });
            }
        }
    };
};
exports.organizationTypeController = createGenericController(master_data_1.OrganizationType, 'Organization Type');
exports.industryController = createGenericController(master_data_1.Industry, 'Industry');
exports.organizationController = createGenericController(master_data_1.Organization, 'Organization');
exports.countryController = createGenericController(master_data_1.Country, 'Country');
exports.currencyController = createGenericController(master_data_1.Currency, 'Currency');
exports.timezoneController = createGenericController(master_data_1.Timezone, 'Timezone');
exports.dateFormatController = createGenericController(master_data_1.DateFormat, 'Date Format');
exports.languageController = createGenericController(master_data_1.Language, 'Language');
//# sourceMappingURL=genericController.js.map