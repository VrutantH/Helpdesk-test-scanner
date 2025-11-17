// Test script to verify the transformation logic
const apiResponse = {
  "success": true,
  "data": [{
    "_id": "6919d14b1dc77d043afcded3",
    "name": "Low",
    "levels": [
      {
        "level": 1,
        "escalateTo": {
          "type": "role",
          "targetId": "69133e04cdf807d363168a8f",
          "targetName": "Support Manager"
        }
      },
      {
        "level": 2,
        "escalateTo": {
          "type": "role",
          "targetId": "69133e04cdf807d363168a8e",
          "targetName": "Support Administrator"
        }
      }
    ]
  }]
};

console.log('Testing transformation logic...');
console.log('');

const policies = apiResponse.data || [];
console.log('📋 Policies array:', policies);
console.log('📋 Number of policies:', policies.length);
console.log('');

const contacts = policies.flatMap((policy) => {
  console.log('📋 Processing policy:', policy.name, 'Levels:', policy.levels);
  return (policy.levels || []).map((level) => {
    const contact = {
      _id: `${policy._id}-L${level.level}`,
      name: level.escalateTo?.targetName || `Level ${level.level}`,
      email: level.escalateTo?.targetId || '',
      role: level.escalateTo?.type || 'role',
      priority: policy.name || '',
    };
    console.log('📋 Created contact:', contact);
    return contact;
  });
});

console.log('');
console.log('📋 Final contacts array:', contacts);
console.log('📋 Number of contacts:', contacts.length);
console.log('');
console.log('✅ Expected: 2 contacts (Support Manager and Support Administrator)');
console.log('✅ Actual:', contacts.length, 'contacts');
