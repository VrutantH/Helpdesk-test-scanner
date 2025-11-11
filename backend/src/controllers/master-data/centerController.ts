import { Request, Response } from 'express';
import Center from '../../models/master-data/Center';

// Get all centers
export const getCenters = async (req: Request, res: Response) => {
  try {
    const { includeInactive, city, state } = req.query;
    
    let filter: any = {};
    if (includeInactive !== 'true') {
      filter.isActive = true;
    }
    if (city) {
      filter.city = city;
    }
    if (state) {
      filter.state = state;
    }
    
    const centers = await Center.find(filter).sort({ displayOrder: 1, value: 1 });
    
    console.log(`📋 Retrieved ${centers.length} centers`);
    
    return res.json({
      success: true,
      data: centers
    });
  } catch (error) {
    console.error('❌ Error fetching centers:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch centers'
    });
  }
};

// Get center by ID
export const getCenterById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const center = await Center.findById(id);
    
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
  } catch (error) {
    console.error('❌ Error fetching center:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch center'
    });
  }
};

// Create new center
export const createCenter = async (req: Request, res: Response) => {
  try {
    const { 
      key, value, description, displayOrder, isActive, 
      address, city, state, zipcode, timing, 
      googleMapLink, phone, email 
    } = req.body;
    
    // Check if center with same key already exists
    const existingCenter = await Center.findOne({ key: key.toLowerCase() });
    if (existingCenter) {
      return res.status(400).json({
        success: false,
        message: 'Center with this key already exists'
      });
    }
    
    const center = await Center.create({
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
  } catch (error) {
    console.error('❌ Error creating center:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create center'
    });
  }
};

// Update center
export const updateCenter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      key, value, description, displayOrder, isActive, 
      address, city, state, zipcode, timing, 
      googleMapLink, phone, email 
    } = req.body;
    
    const center = await Center.findByIdAndUpdate(
      id,
      {
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
      },
      { new: true, runValidators: true }
    );
    
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
  } catch (error) {
    console.error('❌ Error updating center:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update center'
    });
  }
};

// Delete center
export const deleteCenter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const center = await Center.findByIdAndDelete(id);
    
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
  } catch (error) {
    console.error('❌ Error deleting center:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete center'
    });
  }
};

// Toggle center active status
export const toggleCenterStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const center = await Center.findById(id);
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
  } catch (error) {
    console.error('❌ Error toggling center status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle center status'
    });
  }
};
