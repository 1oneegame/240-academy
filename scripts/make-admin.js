const { MongoClient } = require('mongodb');
require('dotenv').config();

async function makeAdmin() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
  }
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db("240academy");
    
    const email = process.argv[2];
    if (!email) {
      console.log('Usage: node scripts/make-admin.js <email>');
      process.exit(1);
    }
    
    const result = await db.collection('user').updateOne(
      { email: email },
      { $set: { role: 'admin' } }
    );
    
    if (result.matchedCount === 0) {
      console.log(`User with email ${email} not found`);
    } else {
      console.log(`User ${email} is now an admin`);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

makeAdmin();
