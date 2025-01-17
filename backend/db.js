const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Create indexes for better search performance
        const User = require('./models/User');
        await User.collection.createIndex({ "location": "2dsphere" });
        await User.collection.createIndex({ 
            "username": "text", 
            "skills.name": "text", 
            "address": "text" 
        });

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;