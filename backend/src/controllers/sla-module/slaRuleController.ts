import { Request, Response } from 'express';
import SLARule from '../../models/sla-module/SLARule';

// Get all SLA rules
export const getAllSLARules = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId, priority, isActive } = req.query;
    const filter: any = {};

    if (projectId) {
      filter.projectIds = projectId;
    }
    if (priority) {
      filter.priority = priority;
    }
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const slaRules = await SLARule.find(filter)
      .populate('projectIds', 'name code')
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: slaRules,
    });
  } catch (error: any) {
    console.error('Error fetching SLA rules:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch SLA rules',
      error: error.message,
    });
  }
};

// Get single SLA rule
export const getSLARuleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const slaRule = await SLARule.findById(id)
      .populate('projectIds', 'name code')
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');

    if (!slaRule) {
      res.status(404).json({
        success: false,
        message: 'SLA rule not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: slaRule,
    });
  } catch (error: any) {
    console.error('Error fetching SLA rule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch SLA rule',
      error: error.message,
    });
  }
};

// Create SLA rule
export const createSLARule = async (req: Request, res: Response): Promise<void> => {
  try {
    const slaRuleData = {
      ...req.body,
      createdBy: (req as any).user?.userId,
    };

    const slaRule = new SLARule(slaRuleData);
    await slaRule.save();

    const populatedRule = await SLARule.findById(slaRule._id)
      .populate('projectIds', 'name code')
      .populate('createdBy', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'SLA rule created successfully',
      data: populatedRule,
    });
  } catch (error: any) {
    console.error('Error creating SLA rule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create SLA rule',
      error: error.message,
    });
  }
};

// Update SLA rule
export const updateSLARule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedBy: (req as any).user?.userId,
    };

    const slaRule = await SLARule.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('projectIds', 'name code')
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');

    if (!slaRule) {
      res.status(404).json({
        success: false,
        message: 'SLA rule not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'SLA rule updated successfully',
      data: slaRule,
    });
  } catch (error: any) {
    console.error('Error updating SLA rule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update SLA rule',
      error: error.message,
    });
  }
};

// Delete SLA rule
export const deleteSLARule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const slaRule = await SLARule.findByIdAndDelete(id);

    if (!slaRule) {
      res.status(404).json({
        success: false,
        message: 'SLA rule not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'SLA rule deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting SLA rule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete SLA rule',
      error: error.message,
    });
  }
};

// Toggle SLA rule status
export const toggleSLARuleStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const slaRule = await SLARule.findById(id);

    if (!slaRule) {
      res.status(404).json({
        success: false,
        message: 'SLA rule not found',
      });
      return;
    }

    slaRule.isActive = !slaRule.isActive;
    slaRule.updatedBy = (req as any).user?.userId;
    await slaRule.save();

    res.status(200).json({
      success: true,
      message: `SLA rule ${slaRule.isActive ? 'activated' : 'deactivated'} successfully`,
      data: slaRule,
    });
  } catch (error: any) {
    console.error('Error toggling SLA rule status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle SLA rule status',
      error: error.message,
    });
  }
};
