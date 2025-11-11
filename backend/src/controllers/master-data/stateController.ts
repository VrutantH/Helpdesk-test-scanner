import { Request, Response } from 'express';
import State from '../../models/master-data/State';

// Get all states
export const getStates = async (req: Request, res: Response) => {
  try {
    const { includeInactive } = req.query;
    const filter = includeInactive === 'true' ? {} : { isActive: true };
    
    const states = await State.find(filter).sort({ displayOrder: 1, value: 1 });
    
    console.log(`📋 Retrieved ${states.length} states`);
    
    return res.json({
      success: true,
      data: states
    });
  } catch (error) {
    console.error('❌ Error fetching states:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch states'
    });
  }
};

// Get state by ID
export const getStateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const state = await State.findById(id);
    
    if (!state) {
      return res.status(404).json({
        success: false,
        message: 'State not found'
      });
    }
    
    return res.json({
      success: true,
      data: state
    });
  } catch (error) {
    console.error('❌ Error fetching state:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch state'
    });
  }
};

// Create new state
export const createState = async (req: Request, res: Response) => {
  try {
    const { key, value, description, displayOrder, isActive, country } = req.body;
    
    // Check if state with same key already exists
    const existingState = await State.findOne({ key: key.toLowerCase() });
    if (existingState) {
      return res.status(400).json({
        success: false,
        message: 'State with this key already exists'
      });
    }
    
    const state = await State.create({
      key: key.toLowerCase(),
      value,
      description,
      displayOrder: displayOrder || 0,
      isActive: isActive !== undefined ? isActive : true,
      country: country || 'india'
    });
    
    console.log(`✅ Created state: ${state.value}`);
    
    return res.status(201).json({
      success: true,
      message: 'State created successfully',
      data: state
    });
  } catch (error) {
    console.error('❌ Error creating state:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create state'
    });
  }
};

// Update state
export const updateState = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { key, value, description, displayOrder, isActive, country } = req.body;
    
    const state = await State.findByIdAndUpdate(
      id,
      {
        key: key?.toLowerCase(),
        value,
        description,
        displayOrder,
        isActive,
        country,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!state) {
      return res.status(404).json({
        success: false,
        message: 'State not found'
      });
    }
    
    console.log(`✅ Updated state: ${state.value}`);
    
    return res.json({
      success: true,
      message: 'State updated successfully',
      data: state
    });
  } catch (error) {
    console.error('❌ Error updating state:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update state'
    });
  }
};

// Delete state
export const deleteState = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const state = await State.findByIdAndDelete(id);
    
    if (!state) {
      return res.status(404).json({
        success: false,
        message: 'State not found'
      });
    }
    
    console.log(`🗑️  Deleted state: ${state.value}`);
    
    return res.json({
      success: true,
      message: 'State deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting state:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete state'
    });
  }
};

// Toggle state active status
export const toggleStateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const state = await State.findById(id);
    if (!state) {
      return res.status(404).json({
        success: false,
        message: 'State not found'
      });
    }
    
    state.isActive = !state.isActive;
    await state.save();
    
    console.log(`🔄 Toggled state status: ${state.value} - ${state.isActive ? 'Active' : 'Inactive'}`);
    
    return res.json({
      success: true,
      message: `State ${state.isActive ? 'activated' : 'deactivated'} successfully`,
      data: state
    });
  } catch (error) {
    console.error('❌ Error toggling state status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle state status'
    });
  }
};
