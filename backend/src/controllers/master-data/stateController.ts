import { Request, Response } from 'express';
import { State } from '../../models/master-data/State';

// Get all states
export const getStates = async (req: Request, res: Response) => {
  try {
    const { includeInactive, country } = req.query;
    
    const filter: any = {};
    if (includeInactive !== 'true') {
      filter.isActive = true;
    }
    if (country) {
      filter.country = country;
    }

    const states = await State.find(filter).sort({ displayOrder: 1, value: 1 });

    return res.json({
      success: true,
      data: states,
    });
  } catch (error) {
    console.error('Get states error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Create a new state
export const createState = async (req: Request, res: Response) => {
  try {
    const { key, value, country, displayOrder } = req.body;

    if (!key || !value || !country) {
      return res.status(400).json({
        success: false,
        message: 'Key, value, and country are required',
      });
    }

    const existingState = await State.findOne({ key });
    if (existingState) {
      return res.status(400).json({
        success: false,
        message: 'State with this key already exists',
      });
    }

    const state = new State({
      key,
      value,
      country,
      displayOrder: displayOrder || 0,
      isActive: true,
    });

    await state.save();

    return res.status(201).json({
      success: true,
      data: state,
    });
  } catch (error: any) {
    console.error('Create state error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Update a state
export const updateState = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { key, value, country, displayOrder, isActive } = req.body;

    const state = await State.findById(id);
    if (!state) {
      return res.status(404).json({
        success: false,
        message: 'State not found',
      });
    }

    if (key) state.key = key;
    if (value) state.value = value;
    if (country) state.country = country;
    if (displayOrder !== undefined) state.displayOrder = displayOrder;
    if (isActive !== undefined) state.isActive = isActive;

    await state.save();

    return res.json({
      success: true,
      data: state,
    });
  } catch (error: any) {
    console.error('Update state error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Delete a state
export const deleteState = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const state = await State.findByIdAndDelete(id);
    if (!state) {
      return res.status(404).json({
        success: false,
        message: 'State not found',
      });
    }

    return res.json({
      success: true,
      message: 'State deleted successfully',
    });
  } catch (error) {
    console.error('Delete state error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
