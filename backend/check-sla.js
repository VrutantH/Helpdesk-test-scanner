const mongoose = require('mongoose');

async function checkSLA() {
  try {
    await mongoose.connect('mongodb://localhost:27017/helpdesk');
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\nAll Collections:');
    collections.forEach(col => console.log('  -', col.name));
    
    // Check for SLA-related collections
    const slaCollections = collections.filter(c => 
      c.name.toLowerCase().includes('sla') || 
      c.name.toLowerCase().includes('escalation')
    );
    
    if (slaCollections.length > 0) {
      console.log('\nSLA/Escalation Collections Found:');
      for (const col of slaCollections) {
        console.log(`\n${col.name}:`);
        const data = await db.collection(col.name).find({}).limit(5).toArray();
        console.log(`  Count: ${await db.collection(col.name).countDocuments()}`);
        if (data.length > 0) {
          console.log('  Sample:', JSON.stringify(data[0], null, 2));
        }
      }
    } else {
      console.log('\nNo SLA/Escalation collections found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkSLA();
