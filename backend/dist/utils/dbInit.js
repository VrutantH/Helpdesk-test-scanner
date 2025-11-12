"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseStats = exports.createIndexes = exports.initializeDatabase = void 0;
const User_1 = require("../models/User");
const Ticket_1 = require("../models/Ticket");
const Role_1 = require("../models/Role");
const seedMasterDataNew_1 = require("./seedMasterDataNew");
const initializeDatabase = async () => {
    try {
        console.log('🔄 Initializing database...');
        await (0, seedMasterDataNew_1.seedMasterData)();
        await createDefaultAdmin();
        await createSampleData();
        console.log('✅ Database initialization completed');
    }
    catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    }
};
exports.initializeDatabase = initializeDatabase;
const createDefaultAdmin = async () => {
    try {
        const superAdminRole = await Role_1.Role.findOne({ code: 'SUPER_ADMIN' });
        if (!superAdminRole) {
            console.log('⚠️  Super Admin role not found. Please run role seeding first.');
            return;
        }
        const adminExists = await User_1.User.findOne({
            email: 'admin@helpdesk.gov.in'
        });
        if (!adminExists) {
            const admin = new User_1.User({
                email: 'admin@helpdesk.gov.in',
                password: 'admin123',
                firstName: 'Super',
                lastName: 'Admin',
                mobile: '9876543210',
                role: superAdminRole._id,
                isActive: true,
                eulaAccepted: true
            });
            await admin.save();
            console.log('✅ Default admin user created:');
            console.log('   📧 Email: admin@helpdesk.gov.in');
            console.log('   📱 Mobile: 9876543210');
            console.log('   🔑 Password: admin123');
        }
        else {
            console.log('ℹ️  Default admin user already exists');
        }
    }
    catch (error) {
        console.error('❌ Failed to create default admin:', error);
        throw error;
    }
};
const createSampleData = async () => {
    try {
        const ticketCount = await Ticket_1.Ticket.countDocuments();
        if (ticketCount === 0) {
            console.log('🔄 Creating sample tickets...');
            const admin = await User_1.User.findOne({ email: 'admin@helpdesk.gov.in' });
            if (!admin) {
                console.log('⚠️  Admin user not found, skipping sample tickets');
                return;
            }
            const sampleTickets = [
                {
                    title: 'Email access issue',
                    description: 'Unable to access government email account. Getting authentication error when trying to log in.',
                    priority: 'high',
                    category: 'Email & Communication',
                    createdBy: admin._id,
                    status: 'open'
                },
                {
                    title: 'Software installation request',
                    description: 'Need MS Office 365 installed on workstation for document processing.',
                    priority: 'medium',
                    category: 'Software',
                    createdBy: admin._id,
                    status: 'in_progress',
                    assignedTo: admin._id
                },
                {
                    title: 'Network connectivity problem',
                    description: 'Intermittent internet connection in conference room. Affects video conferencing.',
                    priority: 'urgent',
                    category: 'Network & Infrastructure',
                    createdBy: admin._id,
                    status: 'open'
                },
                {
                    title: 'Password reset request',
                    description: 'Forgot password for government portal access. Need immediate reset.',
                    priority: 'medium',
                    category: 'Account & Access',
                    createdBy: admin._id,
                    status: 'resolved',
                    resolution: 'Password reset successfully completed. User notified via email.'
                }
            ];
            for (const ticketData of sampleTickets) {
                const ticket = new Ticket_1.Ticket(ticketData);
                await ticket.save();
            }
            console.log(`✅ Created ${sampleTickets.length} sample tickets`);
        }
        else {
            console.log('ℹ️  Sample tickets already exist, skipping creation');
        }
    }
    catch (error) {
        console.error('❌ Failed to create sample data:', error);
    }
};
const createIndexes = async () => {
    try {
        console.log('🔄 Creating database indexes...');
        await User_1.User.createIndexes();
        await Ticket_1.Ticket.createIndexes();
        console.log('✅ Database indexes created successfully');
    }
    catch (error) {
        console.error('❌ Failed to create indexes:', error);
        throw error;
    }
};
exports.createIndexes = createIndexes;
const getDatabaseStats = async () => {
    try {
        const userCount = await User_1.User.countDocuments();
        const ticketCount = await Ticket_1.Ticket.countDocuments();
        const ticketStats = await Ticket_1.Ticket.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        return {
            users: userCount,
            tickets: ticketCount,
            ticketsByStatus: ticketStats
        };
    }
    catch (error) {
        console.error('❌ Failed to get database stats:', error);
        return null;
    }
};
exports.getDatabaseStats = getDatabaseStats;
//# sourceMappingURL=dbInit.js.map