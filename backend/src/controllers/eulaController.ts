import { Request, Response } from 'express';
import { User } from '../models/User';
import EulaAcceptance from '../models/EulaAcceptance';

// Current EULA version - increment when EULA content changes
const CURRENT_EULA_VERSION = '1.0';

/**
 * Helper function to extract IP address from request
 */
const getClientIp = (req: Request): string => {
  // Check for various headers that might contain the real IP
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = (forwarded as string).split(',');
    return ips[0].trim();
  }
  
  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    return realIp as string;
  }
  
  return req.socket.remoteAddress || 'Unknown';
};

/**
 * Accept EULA - Save acceptance record in separate table
 */
export const acceptEula = async (req: Request, res: Response) => {
  try {
    const { userId, eulaVersion } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Find the user and populate role
    const user = await User.findById(userId).populate('role');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Extract role code from populated role object
    let roleCode = 'user'; // default
    if (user.role && typeof user.role === 'object' && 'code' in user.role) {
      // Map uppercase codes to lowercase: SUPER_ADMIN -> super_admin
      roleCode = (user.role as any).code.toLowerCase();
    }
    console.log(`🔍 User role: ${roleCode}, Role object:`, user.role);

    const versionToAccept = eulaVersion || CURRENT_EULA_VERSION;

    // Check if user has already accepted this version
    const existingAcceptance = await EulaAcceptance.findOne({
      userId: user._id,
      eulaVersion: versionToAccept
    });

    if (existingAcceptance) {
      console.log(`ℹ️  User ${user.email} has already accepted EULA version ${versionToAccept}`);
      return res.json({
        success: true,
        message: 'EULA already accepted',
        acceptance: {
          id: existingAcceptance._id,
          userName: existingAcceptance.userName,
          userEmail: existingAcceptance.userEmail,
          userRole: existingAcceptance.userRole,
          ipAddress: existingAcceptance.ipAddress,
          eulaVersion: existingAcceptance.eulaVersion,
          acceptedAt: existingAcceptance.acceptedAt
        }
      });
    }

    // Get client information
    const ipAddress = getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Create EULA acceptance record
    const eulaAcceptance = await EulaAcceptance.create({
      userId: user._id,
      userName: `${user.firstName} ${user.lastName}`.trim(),
      userEmail: user.email,
      userRole: roleCode,
      ipAddress,
      userAgent,
      eulaVersion: versionToAccept,
      acceptedAt: new Date()
    });

    console.log(`✅ EULA Acceptance recorded - User: ${user.email}, IP: ${ipAddress}, Role: ${roleCode}, Version: ${eulaAcceptance.eulaVersion}`);

    return res.json({
      success: true,
      message: 'EULA accepted successfully',
      acceptance: {
        id: eulaAcceptance._id,
        userName: eulaAcceptance.userName,
        userEmail: eulaAcceptance.userEmail,
        userRole: eulaAcceptance.userRole,
        ipAddress: eulaAcceptance.ipAddress,
        eulaVersion: eulaAcceptance.eulaVersion,
        acceptedAt: eulaAcceptance.acceptedAt
      }
    });

  } catch (error) {
    console.error('❌ Accept EULA error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Check EULA status - Check if user has accepted current version
 */
export const checkEulaStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const user = await User.findById(userId).populate('role');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has accepted the current EULA version
    const acceptance = await EulaAcceptance.findOne({
      userId: user._id,
      eulaVersion: CURRENT_EULA_VERSION
    }).sort({ acceptedAt: -1 });

    const hasAccepted = !!acceptance;

    console.log(`ℹ️  EULA Status check - User: ${user.email}, Accepted: ${hasAccepted}, Version: ${CURRENT_EULA_VERSION}`);

    return res.json({
      success: true,
      eulaAccepted: hasAccepted,
      eulaVersion: CURRENT_EULA_VERSION,
      acceptance: acceptance ? {
        ipAddress: acceptance.ipAddress,
        acceptedAt: acceptance.acceptedAt,
        eulaVersion: acceptance.eulaVersion
      } : null
    });

  } catch (error) {
    console.error('❌ Check EULA status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get user's EULA acceptance history
 */
export const getEulaHistory = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Get all EULA acceptances for this user
    const acceptances = await EulaAcceptance.find({ userId })
      .sort({ acceptedAt: -1 })
      .limit(10);

    return res.json({
      success: true,
      count: acceptances.length,
      acceptances: acceptances.map(acc => ({
        id: acc._id,
        userName: acc.userName,
        userEmail: acc.userEmail,
        userRole: acc.userRole,
        ipAddress: acc.ipAddress,
        userAgent: acc.userAgent,
        eulaVersion: acc.eulaVersion,
        acceptedAt: acc.acceptedAt
      }))
    });

  } catch (error) {
    console.error('❌ Get EULA history error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
