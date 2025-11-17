import { Request, Response } from 'express';
import { Category } from '../models/Category';
import { Project } from '../models/Project';
import { AuthRequest } from '../middleware/auth';

// Get all categories for a project
export const getCategoriesByProject = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { includeInactive } = req.query;

    const filter: any = { projectId };
    if (includeInactive !== 'true') {
      filter.isActive = true;
    }

    const categories = await Category.find(filter)
      .sort({ order: 1, name: 1 })
      .select('name description color icon order isActive');

    return res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Create a new category
export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { name, description, color, icon, order } = req.body;
    const userId = req.user?.userId;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name, projectId });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists in this project',
      });
    }

    const category = new Category({
      name,
      description,
      projectId,
      color,
      icon,
      order,
      createdBy: userId,
    });

    await category.save();

    // Also update project configuration to include this category in onlineFormFields
    const categoryField = project.configuration?.ticketSubmissionSettings?.onlineFormFields?.find(
      (field: any) => field.fieldName === 'Category'
    );

    if (categoryField) {
      if (!categoryField.options) {
        categoryField.options = [];
      }
      if (!categoryField.options.includes(name)) {
        categoryField.options.push(name);
        await project.save();
      }
    } else {
      // Create category field if it doesn't exist
      if (!project.configuration) {
        project.configuration = {};
      }
      if (!project.configuration.ticketSubmissionSettings) {
        project.configuration.ticketSubmissionSettings = {};
      }
      if (!project.configuration.ticketSubmissionSettings.onlineFormFields) {
        project.configuration.ticketSubmissionSettings.onlineFormFields = [];
      }
      project.configuration.ticketSubmissionSettings.onlineFormFields.push({
        fieldName: 'Category',
        fieldType: 'dropdown',
        required: true,
        placeholder: 'Select category',
        options: [name],
      });
      await project.save();
    }

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    console.error('Create category error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Update a category
export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { categoryId } = req.params;
    const { name, description, color, icon, order, isActive } = req.body;
    const userId = req.user?.userId;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const oldName = category.name;

    // Update category fields
    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    if (color !== undefined) category.color = color;
    if (icon !== undefined) category.icon = icon;
    if (order !== undefined) category.order = order;
    if (isActive !== undefined) category.isActive = isActive;
    category.updatedBy = userId as any;

    await category.save();

    // If name changed, update project configuration
    if (name && name !== oldName) {
      const project = await Project.findById(category.projectId);
      if (project) {
        const categoryField = project.configuration?.ticketSubmissionSettings?.onlineFormFields?.find(
          (field: any) => field.fieldName === 'Category'
        );
        if (categoryField?.options) {
          const index = categoryField.options.indexOf(oldName);
          if (index !== -1) {
            categoryField.options[index] = name;
            await project.save();
          }
        }
      }
    }

    return res.json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    console.error('Update category error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Delete a category
export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const categoryName = category.name;
    const projectId = category.projectId;

    // Soft delete - just mark as inactive
    category.isActive = false;
    await category.save();

    // Remove from project configuration
    const project = await Project.findById(projectId);
    if (project) {
      const categoryField = project.configuration?.ticketSubmissionSettings?.onlineFormFields?.find(
        (field: any) => field.fieldName === 'Category'
      );
      if (categoryField?.options) {
        categoryField.options = categoryField.options.filter((opt: string) => opt !== categoryName);
        await project.save();
      }
    }

    return res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Delete category error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get a single category
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    return res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Get category error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
