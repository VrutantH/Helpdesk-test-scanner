"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectBranding = exports.getProjectStats = exports.updateProjectModules = exports.toggleProjectStatus = exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectById = exports.getAllProjects = void 0;
const Project_1 = require("../models/Project");
const User_1 = require("../models/User");
const getAllProjects = async (req, res) => {
    try {
        const { search, status, page = 1, limit = 10 } = req.query;
        const query = {};
        if (search && typeof search === 'string') {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } },
                { projectId: { $regex: search, $options: 'i' } },
            ];
        }
        if (status) {
            query.status = status;
        }
        const skip = (Number(page) - 1) * Number(limit);
        const projects = await Project_1.Project.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .populate('createdBy', 'firstName lastName email')
            .populate('updatedBy', 'firstName lastName email');
        const projectsWithUserCount = await Promise.all(projects.map(async (project) => {
            const userCount = await User_1.User.countDocuments({ projects: project._id });
            return {
                ...project.toObject(),
                users: userCount,
            };
        }));
        const total = await Project_1.Project.countDocuments(query);
        console.log(`📋 Retrieved ${projects.length} projects (Total: ${total})`);
        return res.json({
            success: true,
            data: {
                projects: projectsWithUserCount,
                pagination: {
                    currentPage: Number(page),
                    totalPages: Math.ceil(total / Number(limit)),
                    totalItems: total,
                    itemsPerPage: Number(limit),
                },
            },
        });
    }
    catch (error) {
        console.error('Get all projects error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
exports.getAllProjects = getAllProjects;
const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project_1.Project.findById(id)
            .populate('createdBy', 'firstName lastName email')
            .populate('updatedBy', 'firstName lastName email');
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }
        const userCount = await User_1.User.countDocuments({ projects: project._id });
        const projectWithUserCount = {
            ...project.toObject(),
            users: userCount,
        };
        console.log(`📋 Retrieved project: ${project.name} (${userCount} users)`);
        return res.json({
            success: true,
            data: { project: projectWithUserCount },
        });
    }
    catch (error) {
        console.error('Get project by ID error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
exports.getProjectById = getProjectById;
const createProject = async (req, res) => {
    try {
        const projectData = req.body;
        const existingProject = await Project_1.Project.findOne({ code: projectData.code.toUpperCase() });
        if (existingProject) {
            return res.status(400).json({
                success: false,
                message: 'Project code already exists',
            });
        }
        const project = new Project_1.Project({
            ...projectData,
            code: projectData.code.toUpperCase(),
            createdBy: req.body.createdBy,
        });
        await project.save();
        console.log(`✅ Created new project: ${project.name} (${project.projectId})`);
        return res.status(201).json({
            success: true,
            data: { project },
            message: 'Project created successfully',
        });
    }
    catch (error) {
        console.error('Create project error:', error);
        console.error('Error details:', error.message);
        if (error.errors) {
            console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
        }
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error',
            errors: error.errors,
        });
    }
};
exports.createProject = createProject;
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (updateData.code) {
            const existingProject = await Project_1.Project.findOne({
                code: updateData.code.toUpperCase(),
                _id: { $ne: id },
            });
            if (existingProject) {
                return res.status(400).json({
                    success: false,
                    message: 'Project code already exists',
                });
            }
            updateData.code = updateData.code.toUpperCase();
        }
        const project = await Project_1.Project.findByIdAndUpdate(id, {
            ...updateData,
            updatedBy: req.body.updatedBy,
        }, { new: true, runValidators: true });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }
        console.log(`✅ Updated project: ${project.name} (${project.projectId})`);
        return res.json({
            success: true,
            data: { project },
            message: 'Project updated successfully',
        });
    }
    catch (error) {
        console.error('Update project error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project_1.Project.findByIdAndDelete(id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }
        console.log(`🗑️ Deleted project: ${project.name} (${project.projectId})`);
        return res.json({
            success: true,
            message: 'Project deleted successfully',
        });
    }
    catch (error) {
        console.error('Delete project error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
exports.deleteProject = deleteProject;
const toggleProjectStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project_1.Project.findById(id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }
        project.isActive = !project.isActive;
        project.status = project.isActive ? 'active' : 'inactive';
        await project.save();
        console.log(`🔄 Toggled project status: ${project.name} -> ${project.status}`);
        return res.json({
            success: true,
            data: { project },
            message: `Project ${project.status === 'active' ? 'activated' : 'deactivated'} successfully`,
        });
    }
    catch (error) {
        console.error('Toggle project status error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
exports.toggleProjectStatus = toggleProjectStatus;
const updateProjectModules = async (req, res) => {
    try {
        const { id } = req.params;
        const { modules } = req.body;
        const project = await Project_1.Project.findByIdAndUpdate(id, { modules }, { new: true, runValidators: true });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }
        console.log(`✅ Updated modules for project: ${project.name}`);
        return res.json({
            success: true,
            data: { project },
            message: 'Project modules updated successfully',
        });
    }
    catch (error) {
        console.error('Update project modules error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
exports.updateProjectModules = updateProjectModules;
const getProjectStats = async (req, res) => {
    try {
        const totalProjects = await Project_1.Project.countDocuments();
        const activeProjects = await Project_1.Project.countDocuments({ status: 'active' });
        const inactiveProjects = await Project_1.Project.countDocuments({ status: 'inactive' });
        const suspendedProjects = await Project_1.Project.countDocuments({ status: 'suspended' });
        return res.json({
            success: true,
            data: {
                total: totalProjects,
                active: activeProjects,
                inactive: inactiveProjects,
                suspended: suspendedProjects,
            },
        });
    }
    catch (error) {
        console.error('Get project stats error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
exports.getProjectStats = getProjectStats;
const getProjectBranding = async (req, res) => {
    try {
        const { urlPath } = req.params;
        console.log(`🔍 Looking for project with customUrlPath: ${urlPath}`);
        const project = await Project_1.Project.findOne({ customUrlPath: urlPath });
        if (!project) {
            console.log(`❌ Project not found with customUrlPath: ${urlPath}`);
            return res.status(404).json({
                success: false,
                message: 'Project not found',
                error: 'No project found with this URL path',
            });
        }
        const brandingData = {
            projectId: project._id.toString(),
            name: project.name,
            customUrlPath: project.customUrlPath,
            primaryColor: project.primaryColor || '#2563EB',
            secondaryColor: project.secondaryColor || '#764ba2',
            logoUrl: project.logoUrl,
            welcomeText: project.welcomeText,
            footerText: project.footerText,
        };
        console.log(`✅ Found project branding: ${project.name}`);
        return res.json({
            success: true,
            data: brandingData,
        });
    }
    catch (error) {
        console.error('Get project branding error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
exports.getProjectBranding = getProjectBranding;
//# sourceMappingURL=projectController.js.map