"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleRoleStatus = exports.getAllPermissions = exports.deleteRole = exports.updateRole = exports.createRole = exports.getRoleById = exports.getAllRoles = void 0;
const Role_1 = require("../models/Role");
const Permission_1 = require("../models/Permission");
const getAllRoles = async (req, res) => {
    try {
        const { projectId, type, search } = req.query;
        const filter = {};
        if (projectId) {
            filter.$or = [
                { projectId: projectId },
                { type: 'system' }
            ];
        }
        if (type) {
            filter.type = type;
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        const roles = await Role_1.Role.find(filter)
            .populate('permissions')
            .sort({ type: -1, name: 1 });
        res.json({
            success: true,
            data: roles,
        });
    }
    catch (error) {
        console.error('Get roles error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch roles',
        });
    }
};
exports.getAllRoles = getAllRoles;
const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role_1.Role.findById(id).populate('permissions');
        if (!role) {
            res.status(404).json({
                success: false,
                message: 'Role not found',
            });
            return;
        }
        res.json({
            success: true,
            data: role,
        });
    }
    catch (error) {
        console.error('Get role error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch role',
        });
    }
};
exports.getRoleById = getRoleById;
const createRole = async (req, res) => {
    try {
        const { name, code, description, projectId, permissions } = req.body;
        const existingRole = await Role_1.Role.findOne({
            code: code.toUpperCase(),
            projectId: projectId || null
        });
        if (existingRole) {
            res.status(400).json({
                success: false,
                message: 'Role with this code already exists for this project',
            });
            return;
        }
        const role = new Role_1.Role({
            name,
            code: code.toUpperCase(),
            description,
            projectId: projectId || null,
            permissions: permissions || [],
            type: 'custom',
        });
        await role.save();
        const populatedRole = await Role_1.Role.findById(role._id).populate('permissions');
        res.status(201).json({
            success: true,
            message: 'Role created successfully',
            data: populatedRole,
        });
    }
    catch (error) {
        console.error('Create role error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create role',
        });
    }
};
exports.createRole = createRole;
const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, permissions } = req.body;
        const role = await Role_1.Role.findById(id);
        if (!role) {
            res.status(404).json({
                success: false,
                message: 'Role not found',
            });
            return;
        }
        if (role.type === 'system') {
            res.status(403).json({
                success: false,
                message: 'System roles cannot be modified',
            });
            return;
        }
        role.name = name || role.name;
        role.description = description !== undefined ? description : role.description;
        role.permissions = permissions || role.permissions;
        await role.save();
        const updatedRole = await Role_1.Role.findById(role._id).populate('permissions');
        res.json({
            success: true,
            message: 'Role updated successfully',
            data: updatedRole,
        });
    }
    catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update role',
        });
    }
};
exports.updateRole = updateRole;
const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role_1.Role.findById(id);
        if (!role) {
            res.status(404).json({
                success: false,
                message: 'Role not found',
            });
            return;
        }
        if (role.type === 'system') {
            res.status(403).json({
                success: false,
                message: 'System roles cannot be deleted',
            });
            return;
        }
        if (role.agentCount > 0) {
            res.status(400).json({
                success: false,
                message: `Cannot delete role. ${role.agentCount} agent(s) are currently assigned to this role`,
            });
            return;
        }
        await Role_1.Role.findByIdAndDelete(id);
        res.json({
            success: true,
            message: 'Role deleted successfully',
        });
    }
    catch (error) {
        console.error('Delete role error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete role',
        });
    }
};
exports.deleteRole = deleteRole;
const getAllPermissions = async (req, res) => {
    try {
        const { category, search } = req.query;
        const filter = { isActive: true };
        if (category) {
            filter.category = category;
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { module: { $regex: search, $options: 'i' } }
            ];
        }
        const permissions = await Permission_1.Permission.find(filter).sort({ category: 1, module: 1, name: 1 });
        const groupedPermissions = permissions.reduce((acc, perm) => {
            if (!acc[perm.category]) {
                acc[perm.category] = [];
            }
            acc[perm.category].push(perm);
            return acc;
        }, {});
        res.json({
            success: true,
            data: {
                all: permissions,
                grouped: groupedPermissions,
            },
        });
    }
    catch (error) {
        console.error('Get permissions error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch permissions',
        });
    }
};
exports.getAllPermissions = getAllPermissions;
const toggleRoleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role_1.Role.findById(id);
        if (!role) {
            res.status(404).json({
                success: false,
                message: 'Role not found',
            });
            return;
        }
        if (role.type === 'system') {
            res.status(403).json({
                success: false,
                message: 'System roles cannot be deactivated',
            });
            return;
        }
        role.isActive = !role.isActive;
        await role.save();
        res.json({
            success: true,
            message: `Role ${role.isActive ? 'activated' : 'deactivated'} successfully`,
            data: role,
        });
    }
    catch (error) {
        console.error('Toggle role status error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to toggle role status',
        });
    }
};
exports.toggleRoleStatus = toggleRoleStatus;
//# sourceMappingURL=roleController.js.map