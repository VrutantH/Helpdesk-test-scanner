// Test if JWT token contains permissions
const jwt = require('jsonwebtoken');

// Get token from command line argument
const token = process.argv[2];

if (!token) {
  console.log('❌ Usage: node test-jwt-permissions.js <YOUR_JWT_TOKEN>');
  console.log('\n📋 To get your token:');
  console.log('   1. Open browser DevTools (F12)');
  console.log('   2. Go to Application tab → Local Storage');
  console.log('   3. Find "authToken" key');
  console.log('   4. Copy the value');
  process.exit(1);
}

const secret = 'your-super-secret-jwt-key-change-this-in-production';

try {
  const decoded = jwt.verify(token, secret);
  
  console.log('✅ Token is valid!\n');
  console.log('📋 Token Contents:');
  console.log(`   User ID: ${decoded.userId}`);
  console.log(`   Email: ${decoded.email}`);
  console.log(`   Role: ${decoded.role?.name || 'None'}`);
  console.log(`   Role Code: ${decoded.role?.code || 'None'}`);
  console.log(`   Permissions Count: ${decoded.role?.permissions?.length || 0}`);
  
  if (decoded.role?.permissions?.length > 0) {
    console.log('\n✅ Token HAS permissions!');
    
    // Check for RBAC permissions
    const rbacPerms = ['RBAC_VIEW_ROLES', 'RBAC_CREATE_ROLE', 'RBAC_EDIT_ROLE', 'RBAC_DELETE_ROLE'];
    console.log('\n🔍 Checking for RBAC permission IDs:');
    console.log(`   Total permission IDs in token: ${decoded.role.permissions.length}`);
    console.log('\n   ⚠️  Note: Permissions are stored as MongoDB ObjectIds');
    console.log('   To verify, compare with database permission IDs');
  } else {
    console.log('\n❌ Token DOES NOT have permissions!');
    console.log('   Action needed: LOG OUT and LOG IN again to get updated token');
  }
  
  console.log('\n⏰ Token Expiry:');
  const expiryDate = new Date(decoded.exp * 1000);
  console.log(`   Expires at: ${expiryDate}`);
  console.log(`   Time remaining: ${Math.floor((decoded.exp * 1000 - Date.now()) / (1000 * 60 * 60 * 24))} days`);
  
} catch (error) {
  console.log('❌ Invalid token or error:', error.message);
}
