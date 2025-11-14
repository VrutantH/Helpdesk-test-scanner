import { Request, Response } from 'express';
import { Ticket } from '../models/Ticket';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { Role } from '../models/Role';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

/**
 * Get next agent for round-robin assignment
 */
const getNextRoundRobinAgent = async (projectId: string, eligibleUserIds: mongoose.Types.ObjectId[]): Promise<mongoose.Types.ObjectId | null> => {
  if (eligibleUserIds.length === 0) return null;
  
  // Find the last assigned ticket for this project
  const lastTicket = await Ticket.findOne({ 
    'metadata.projectId': projectId,
    assignedTo: { $exists: true, $ne: null }
  }).sort({ createdAt: -1 });
  
  if (!lastTicket || !lastTicket.assignedTo) {
    // No previous assignment, return first agent
    return eligibleUserIds[0];
  }
  
  // Find the index of last assigned agent
  const lastAgentIndex = eligibleUserIds.findIndex(id => id.toString() === lastTicket.assignedTo?.toString());
  
  // Return next agent in rotation (or first if last was the end of list)
  const nextIndex = (lastAgentIndex + 1) % eligibleUserIds.length;
  return eligibleUserIds[nextIndex];
};

/**
 * Get agent with least active tickets (load-balanced)
 */
const getLeastLoadedAgent = async (eligibleUserIds: mongoose.Types.ObjectId[]): Promise<mongoose.Types.ObjectId | null> => {
  if (eligibleUserIds.length === 0) return null;
  
  // Count active tickets for each agent
  const ticketCounts = await Promise.all(
    eligibleUserIds.map(async (userId) => {
      const count = await Ticket.countDocuments({
        assignedTo: userId,
        status: { $in: ['open', 'in-progress', 'pending'] }
      });
      return { userId, count };
    })
  );
  
  // Sort by count (ascending) and return agent with least tickets
  ticketCounts.sort((a, b) => a.count - b.count);
  return ticketCounts[0].userId;
};

/**
 * Submit a ticket from student portal
 */
export const submitTicket = async (req: Request, res: Response) => {
  try {
    const { projectId, formData } = req.body;
    
    console.log(`📝 Submitting ticket for project: ${projectId}`);
    
    // Validate project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    
    // Parse form data
    const ticketData = JSON.parse(formData);
    
    // Handle file attachments
    const attachments: any[] = [];
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file: Express.Multer.File) => {
        // Preserve the fieldname so we can map attachments to online form fields
        attachments.push({
          fieldName: file.fieldname,
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          uploadedAt: new Date(),
        });
      });
    }
    
    // Generate ticket number
    const ticketCount = await Ticket.countDocuments();
    const ticketNumber = `TKT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(ticketCount + 1).padStart(4, '0')}`;
    
    // Auto-assignment logic
    let assignedAgent: mongoose.Types.ObjectId | null = null;
    
    if (project.configuration?.ticketAssignmentSettings?.enabled) {
      const assignmentSettings = project.configuration.ticketAssignmentSettings;
      console.log(`🎯 Auto-assignment enabled: ${assignmentSettings.assignmentType}`);
      
      // Get eligible users for assignment
      let eligibleUsers: any[] = [];
      
      if (assignmentSettings.assignToUsers && assignmentSettings.assignToUsers.length > 0) {
        // Use specific user pool
        eligibleUsers = await User.find({
          _id: { $in: assignmentSettings.assignToUsers },
          isActive: true
        });
      } else if (assignmentSettings.assignToRoles && assignmentSettings.assignToRoles.length > 0) {
        // Use role-based pool
        eligibleUsers = await User.find({
          role: { $in: assignmentSettings.assignToRoles },
          isActive: true
        });
      } else {
        // Use all active users
        eligibleUsers = await User.find({ isActive: true });
      }
      
      if (eligibleUsers.length > 0) {
        const eligibleUserIds = eligibleUsers.map(u => u._id);
        
        switch (assignmentSettings.assignmentType) {
          case 'round-robin':
            assignedAgent = await getNextRoundRobinAgent(projectId, eligibleUserIds);
            console.log(`🔄 Round-robin assignment: ${assignedAgent}`);
            break;
            
          case 'load-balanced':
            assignedAgent = await getLeastLoadedAgent(eligibleUserIds);
            console.log(`⚖️ Load-balanced assignment: ${assignedAgent}`);
            break;
            
          case 'condition-based':
            // Find matching rule based on ticket category
            const ticketCategory = ticketData.Category || 'General';
            const matchingRule = assignmentSettings.conditionRules?.find(rule => 
              rule.field === 'category' && 
              rule.operator === 'is' && 
              rule.categories.includes(ticketCategory)
            );
            
            if (matchingRule && matchingRule.assignToAgents.length > 0) {
              // Get agents from the matching rule
              const ruleAgents = await User.find({
                _id: { $in: matchingRule.assignToAgents },
                isActive: true
              });
              
              if (ruleAgents.length > 0) {
                // Use round-robin among rule-specific agents
                const ruleAgentIds = ruleAgents.map(a => a._id);
                assignedAgent = await getNextRoundRobinAgent(projectId, ruleAgentIds);
                console.log(`🎯 Condition-based assignment (Category: ${ticketCategory}): ${assignedAgent}`);
              } else {
                console.log(`⚠️ No active agents found in matching rule for category: ${ticketCategory}`);
              }
            } else {
              console.log(`⚠️ No matching condition rule for category: ${ticketCategory}`);
            }
            break;
            
          case 'manual':
          default:
            console.log(`✋ Manual assignment - ticket will be unassigned`);
            break;
        }
      } else {
        console.log(`⚠️ No eligible users found for auto-assignment`);
      }
    }
    
    // Create ticket (using a system user ID for student submissions)
    // In a real implementation, you'd create a guest user or use a dedicated system user
    const systemUserId = new mongoose.Types.ObjectId(); // Placeholder
    
    const ticket = new Ticket({
      ticketNumber,
      title: ticketData.Subject || 'New Ticket',
      description: ticketData.Description || '',
      status: 'open',
      priority: 'medium',
      category: ticketData.Category || 'General',
      createdBy: systemUserId, // Required field
      assignedTo: assignedAgent, // Auto-assigned agent (if enabled)
      attachments,
      tags: [`student-submission`, `project-${projectId}`],
      // Store student contact info in custom metadata
      metadata: {
        studentName: ticketData.Name,
        studentEmail: ticketData.Email,
        studentPhone: ticketData.Phone,
        projectId,
        submissionType: 'online',
        autoAssigned: !!assignedAgent,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    await ticket.save();
    
    console.log(`✅ Ticket created successfully: ${ticket._id}${assignedAgent ? ` | Assigned to: ${assignedAgent}` : ' | Unassigned'}`);
    
    // Check if student user exists, create if first time
    const studentEmail = ticketData.Email;
    const studentName = ticketData.Name || 'Student';
    
    if (studentEmail) {
      let studentUser = await User.findOne({ email: studentEmail });
      
      if (!studentUser) {
        console.log(`📧 First-time student submission detected: ${studentEmail}`);
        
        // Get STUDENT role
        const studentRole = await Role.findOne({ code: 'STUDENT' });
        
        if (studentRole) {
          // Create new student user
          const nameParts = studentName.split(' ');
          studentUser = await User.create({
            email: studentEmail,
            firstName: nameParts[0] || 'Student',
            lastName: nameParts.slice(1).join(' ') || '',
            role: studentRole._id,
            projects: [projectId],
            isActive: true,
            requirePasswordSetup: true, // Flag for first-time password setup via OTP
          });
          
          console.log(`✅ Student user created: ${studentUser._id} | ${studentEmail}`);
          
          // TODO: Send welcome email with OTP link
          // await sendStudentWelcomeEmail(studentEmail, project.name);
        } else {
          console.error('⚠️ STUDENT role not found - cannot create student user');
        }
      } else {
        console.log(`📌 Existing student user found: ${studentUser._id}`);
      }
    }
    
    return res.status(201).json({
      success: true,
      message: 'Ticket submitted successfully',
      data: {
        ticketId: ticket._id,
        ticketNumber: ticket.ticketNumber,
      },
    });
    
  } catch (error) {
    console.error('Submit ticket error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit ticket',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Get tickets for logged-in student user
 */
export const getMyTickets = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Get user to find their email
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Find all tickets where studentEmail matches user's email
    const tickets = await Ticket.find({
      'metadata.studentEmail': user.email,
    })
      .populate('assignedTo', 'firstName lastName email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: tickets,
    });

  } catch (error) {
    console.error('Get my tickets error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch tickets',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Get tickets assigned to the current agent
 */
export const getAgentAssignedTickets = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Build query to find tickets assigned to this agent
    const query: any = {
      assignedTo: userId,
    };

    // Filter by project if projectId is provided
    if (req.query.projectId) {
      query['metadata.projectId'] = req.query.projectId;
    }

    // Find all tickets assigned to this agent
    const tickets = await Ticket.find(query)
      .populate('assignedTo', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: tickets,
    });

  } catch (error) {
    console.error('Get agent assigned tickets error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch assigned tickets',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Multer configuration for file uploads
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/tickets');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${ext} is not allowed`));
    }
  }
});

/**
 * Get single ticket by ID
 */
export const getTicketById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Get user to verify ownership
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Find ticket and verify student email matches
    const ticket = await Ticket.findById(id)
      .populate('assignedTo', 'firstName lastName email')
      .populate('threads.createdBy', 'firstName lastName email role');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    // Verify student owns this ticket
    if (ticket.metadata?.studentEmail !== user.email) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this ticket',
      });
    }

    return res.status(200).json({
      success: true,
      data: ticket,
    });

  } catch (error) {
    console.error('Get ticket by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch ticket',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Add reply to ticket
 */
export const replyToTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Get user to verify ownership
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Find ticket
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    // Verify student owns this ticket
    if (ticket.metadata?.studentEmail !== user.email) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to reply to this ticket',
      });
    }

    // Check if ticket is closed
    if (ticket.status === 'closed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot reply to a closed ticket',
      });
    }

    // Handle file attachments
    const attachments: any[] = [];
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file: Express.Multer.File) => {
        attachments.push({
          filename: file.filename,
          originalName: file.originalname,
          path: `/uploads/tickets/${file.filename}`,
          mimetype: file.mimetype,
          size: file.size,
        });
      });
    }

    // Add thread to ticket
    if (!ticket.threads) {
      ticket.threads = [];
    }

    ticket.threads.push({
      message,
      createdBy: userId,
      attachments,
      createdAt: new Date(),
    } as any);

    ticket.updatedAt = new Date();
    await ticket.save();

    // Populate the new thread's createdBy field
    await ticket.populate('threads.createdBy', 'firstName lastName email role');

    console.log(`✅ Reply added to ticket: ${ticket._id} by student: ${user.email}`);

    return res.status(200).json({
      success: true,
      message: 'Reply added successfully',
      data: ticket.threads,
    });

  } catch (error) {
    console.error('Reply to ticket error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add reply',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Close ticket by student
 */
export const closeTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Get user to verify ownership
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Find ticket
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    // Verify student owns this ticket
    if (ticket.metadata?.studentEmail !== user.email) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to close this ticket',
      });
    }

    // Check if ticket is already closed
    if (ticket.status === 'closed') {
      return res.status(400).json({
        success: false,
        message: 'Ticket is already closed',
      });
    }

    // Get project to check if student can close tickets
    const project = await Project.findById(ticket.metadata?.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if student is allowed to close tickets
    if (!project.configuration?.ticketSubmissionSettings?.allowStudentToCloseTicket) {
      return res.status(403).json({
        success: false,
        message: 'Students are not allowed to close tickets for this project',
      });
    }

    // Close the ticket
    ticket.status = 'closed';
    ticket.updatedAt = new Date();

    // Add system thread
    if (!ticket.threads) {
      ticket.threads = [];
    }

    ticket.threads.push({
      message: 'Ticket closed by student',
      createdBy: userId,
      isSystemMessage: true,
      createdAt: new Date(),
    } as any);

    await ticket.save();

    console.log(`✅ Ticket closed by student: ${ticket._id} by ${user.email}`);

    return res.status(200).json({
      success: true,
      message: 'Ticket closed successfully',
      data: ticket,
    });

  } catch (error) {
    console.error('Close ticket error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to close ticket',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
