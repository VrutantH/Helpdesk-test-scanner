import mongoose from 'mongoose';
import { User } from '../models/User';
import { Ticket } from '../models/Ticket';
import { Role } from '../models/Role';
import { seedMasterData } from './seedMasterDataNew';

export const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('🔄 Initializing database...');

    // Seed master data first (includes some basic data)
    await seedMasterData();
    
    // Create default admin user (after roles exist)
    await createDefaultAdmin();
    
    // Create sample tickets (optional)
    await createSampleData();
    
    console.log('✅ Database initialization completed');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

const createDefaultAdmin = async (): Promise<void> => {
  try {
    // First, find the Super Admin role
    const superAdminRole = await Role.findOne({ code: 'SUPER_ADMIN' });
    
    if (!superAdminRole) {
      console.log('⚠️  Super Admin role not found. Please run role seeding first.');
      return;
    }

    const adminExists = await User.findOne({ 
      email: 'admin@helpdesk.gov.in'
    });

    if (!adminExists) {
      const admin = new User({
        email: 'admin@helpdesk.gov.in',
        password: 'admin123', // Will be hashed by pre-save middleware
        firstName: 'Super',
        lastName: 'Admin',
        mobile: '9876543210', // Default mobile number for testing
        role: superAdminRole._id, // Use ObjectId reference
        isActive: true,
        eulaAccepted: true // Pre-accept EULA for default admin
      });

      await admin.save();
      console.log('✅ Default admin user created:');
      console.log('   📧 Email: admin@helpdesk.gov.in');
      console.log('   📱 Mobile: 9876543210');
      console.log('   🔑 Password: admin123');
    } else {
      console.log('ℹ️  Default admin user already exists');
    }
  } catch (error) {
    console.error('❌ Failed to create default admin:', error);
    throw error;
  }
};

const createSampleData = async (): Promise<void> => {
  try {
    // Check if any tickets exist
    const ticketCount = await Ticket.countDocuments();
    
    if (ticketCount === 0) {
      console.log('🔄 Creating sample tickets...');
      
      // Get the admin user
      const admin = await User.findOne({ email: 'admin@helpdesk.gov.in' });
      if (!admin) {
        console.log('⚠️  Admin user not found, skipping sample tickets');
        return;
      }

      // Create sample tickets
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
        const ticket = new Ticket(ticketData);
        await ticket.save();
      }

      console.log(`✅ Created ${sampleTickets.length} sample tickets`);
    } else {
      console.log('ℹ️  Sample tickets already exist, skipping creation');
    }
  } catch (error) {
    console.error('❌ Failed to create sample data:', error);
    // Don't throw error for sample data creation failure
  }
};

export const createIndexes = async (): Promise<void> => {
  try {
    console.log('🔄 Creating database indexes...');
    
    // Ensure indexes are created
    await User.createIndexes();
    await Ticket.createIndexes();
    
    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Failed to create indexes:', error);
    throw error;
  }
};

export const getDatabaseStats = async (): Promise<any> => {
  try {
    const userCount = await User.countDocuments();
    const ticketCount = await Ticket.countDocuments();
    const ticketStats = await Ticket.aggregate([
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
  } catch (error) {
    console.error('❌ Failed to get database stats:', error);
    return null;
  }
};
