import { Request, Response } from 'express';
import City from '../../models/master-data/City';

// Get all cities
export const getCities = async (req: Request, res: Response) => {
  try {
    const { includeInactive, state } = req.query;
    
    let filter: any = {};
    if (includeInactive !== 'true') {
      filter.isActive = true;
    }
    if (state) {
      filter.state = state;
    }
    
    const cities = await City.find(filter).sort({ displayOrder: 1, value: 1 });
    
    console.log(`📋 Retrieved ${cities.length} cities`);
    
    return res.json({
      success: true,
      data: cities
    });
  } catch (error) {
    console.error('❌ Error fetching cities:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch cities'
    });
  }
};

// Get city by ID
export const getCityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const city = await City.findById(id);
    
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
  } catch (error) {
    console.error('❌ Error fetching city:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch city'
    });
  }
};

// Create new city
export const createCity = async (req: Request, res: Response) => {
  try {
    const { key, value, description, displayOrder, isActive, state, country } = req.body;
    
    // Check if city with same key already exists
    const existingCity = await City.findOne({ key: key.toLowerCase() });
    if (existingCity) {
      return res.status(400).json({
        success: false,
        message: 'City with this key already exists'
      });
    }
    
    const city = await City.create({
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
  } catch (error) {
    console.error('❌ Error creating city:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create city'
    });
  }
};

// Update city
export const updateCity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { key, value, description, displayOrder, isActive, state, country } = req.body;
    
    const city = await City.findByIdAndUpdate(
      id,
      {
        key: key?.toLowerCase(),
        value,
        description,
        displayOrder,
        isActive,
        state: state?.toLowerCase(),
        country,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
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
  } catch (error) {
    console.error('❌ Error updating city:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update city'
    });
  }
};

// Delete city
export const deleteCity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const city = await City.findByIdAndDelete(id);
    
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
  } catch (error) {
    console.error('❌ Error deleting city:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete city'
    });
  }
};

// Toggle city active status
export const toggleCityStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const city = await City.findById(id);
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
  } catch (error) {
    console.error('❌ Error toggling city status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle city status'
    });
  }
};
