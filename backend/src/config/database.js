const mongoose = require("mongoose");

async function connectDB() {
  try {
    // Make sure MONGO_URI is loaded from .env
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gameforge-ai';
    
    console.log('🔗 Connecting to MongoDB...');
    
    // For Mongoose v7+, we don't need useNewUrlParser and useUnifiedTopology
    await mongoose.connect(mongoURI);
    
    console.log("✅ MongoDB connected successfully!");
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    console.log(`🎯 Connection state: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
    
    return mongoose.connection;
    
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.log('\n📌 Troubleshooting tips:');
    console.log('1. Make sure MongoDB is running: mongod --version');
    console.log('2. Start MongoDB service if not running');
    console.log('3. Check connection string:', process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gameforge-ai');
    process.exit(1);
  }
}

module.exports = connectDB;