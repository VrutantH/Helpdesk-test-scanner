import { Request, Response } from 'express';
import {
  OrganizationType,
  Industry,
  Organization,
  Country,
  Currency,
  Timezone,
  DateFormat,
  Language
} from '../../models/master-data';

// Generic function to create CRUD controllers for simple master data
const createGenericController = (Model: any, name: string) => {
  return {
    // Get all items
    getAll: async (req: Request, res: Response) => {
      try {
        const { includeInactive } = req.query;
        const filter = includeInactive === 'true' ? {} : { isActive: true };
        
        const items = await Model.find(filter).sort({ displayOrder: 1, value: 1 });
        
        console.log(`📋 Retrieved ${items.length} ${name}`);
        
        return res.json({
          success: true,
          data: items
        });
      } catch (error) {
        console.error(`❌ Error fetching ${name}:`, error);
        return res.status(500).json({
          success: false,
          message: `Failed to fetch ${name}`
        });
      }
    },

    // Get by ID
    getById: async (req: Request, res: Response) => {
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
      } catch (error) {
        console.error(`❌ Error fetching ${name}:`, error);
        return res.status(500).json({
          success: false,
          message: `Failed to fetch ${name}`
        });
      }
    },

    // Create new item
    create: async (req: Request, res: Response) => {
      try {
        const { key, ...otherFields } = req.body;
        
        // Check if item with same key already exists
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
      } catch (error) {
        console.error(`❌ Error creating ${name}:`, error);
        return res.status(500).json({
          success: false,
          message: `Failed to create ${name}`
        });
      }
    },

    // Update item
    update: async (req: Request, res: Response) => {
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
        
        const item = await Model.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        );
        
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
      } catch (error) {
        console.error(`❌ Error updating ${name}:`, error);
        return res.status(500).json({
          success: false,
          message: `Failed to update ${name}`
        });
      }
    },

    // Delete item
    delete: async (req: Request, res: Response) => {
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
      } catch (error) {
        console.error(`❌ Error deleting ${name}:`, error);
        return res.status(500).json({
          success: false,
          message: `Failed to delete ${name}`
        });
      }
    },

    // Toggle active status
    toggleStatus: async (req: Request, res: Response) => {
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
      } catch (error) {
        console.error(`❌ Error toggling ${name} status:`, error);
        return res.status(500).json({
          success: false,
          message: `Failed to toggle ${name} status`
        });
      }
    }
  };
};

// Create controllers for each master data type
export const organizationTypeController = createGenericController(OrganizationType, 'Organization Type');
export const industryController = createGenericController(Industry, 'Industry');
export const organizationController = createGenericController(Organization, 'Organization');
export const countryController = createGenericController(Country, 'Country');
export const currencyController = createGenericController(Currency, 'Currency');
export const timezoneController = createGenericController(Timezone, 'Timezone');
export const dateFormatController = createGenericController(DateFormat, 'Date Format');
export const languageController = createGenericController(Language, 'Language');
