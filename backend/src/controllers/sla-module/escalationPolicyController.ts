import { Request, Response } from 'express';
import EscalationPolicy from '../../models/sla-module/EscalationPolicy';

// Get all escalation policies
export const getAllEscalationPolicies = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId, isActive } = req.query;
    const filter: any = {};

    if (projectId) {
      filter.projectId = projectId;
    }
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const policies = await EscalationPolicy.find(filter)
      .populate('projectId', 'name code')
      .populate('projectIds', 'name code')
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: policies,
    });
  } catch (error: any) {
    console.error('Error fetching escalation policies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch escalation policies',
      error: error.message,
    });
  }
};

// Get single escalation policy
export const getEscalationPolicyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const policy = await EscalationPolicy.findById(id)
      .populate('projectId', 'name code')
      .populate('projectIds', 'name code')
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');

    if (!policy) {
      res.status(404).json({
        success: false,
        message: 'Escalation policy not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: policy,
    });
  } catch (error: any) {
    console.error('Error fetching escalation policy:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch escalation policy',
      error: error.message,
    });
  }
};

// Create escalation policy
export const createEscalationPolicy = async (req: Request, res: Response): Promise<void> => {
  try {
    const policyData = {
      ...req.body,
      createdBy: (req as any).user?.userId,
    };

    const policy = new EscalationPolicy(policyData);
    await policy.save();

    const populatedPolicy = await EscalationPolicy.findById(policy._id)
      .populate('projectId', 'name code')
      .populate('projectIds', 'name code')
      .populate('createdBy', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Escalation policy created successfully',
      data: populatedPolicy,
    });
  } catch (error: any) {
    console.error('Error creating escalation policy:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create escalation policy',
      error: error.message,
    });
  }
};

// Update escalation policy
export const updateEscalationPolicy = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedBy: (req as any).user?.userId,
    };

    const policy = await EscalationPolicy.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('projectId', 'name code')
      .populate('projectIds', 'name code')
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');

    if (!policy) {
      res.status(404).json({
        success: false,
        message: 'Escalation policy not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Escalation policy updated successfully',
      data: policy,
    });
  } catch (error: any) {
    console.error('Error updating escalation policy:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update escalation policy',
      error: error.message,
    });
  }
};

// Delete escalation policy
export const deleteEscalationPolicy = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const policy = await EscalationPolicy.findByIdAndDelete(id);

    if (!policy) {
      res.status(404).json({
        success: false,
        message: 'Escalation policy not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Escalation policy deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting escalation policy:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete escalation policy',
      error: error.message,
    });
  }
};

// Toggle escalation policy status
export const toggleEscalationPolicyStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const policy = await EscalationPolicy.findById(id);

    if (!policy) {
      res.status(404).json({
        success: false,
        message: 'Escalation policy not found',
      });
      return;
    }

    policy.isActive = !policy.isActive;
    policy.updatedBy = (req as any).user?.userId;
    await policy.save();

    res.status(200).json({
      success: true,
      message: `Escalation policy ${policy.isActive ? 'activated' : 'deactivated'} successfully`,
      data: policy,
    });
  } catch (error: any) {
    console.error('Error toggling escalation policy status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle escalation policy status',
      error: error.message,
    });
  }
};
