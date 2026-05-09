const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

const connectDB = async () => {
    try {
        let dbUrl = process.env.ATLAS_DB_URL;
        
        if (!dbUrl) {
            console.log("⚠️ No ATLAS_DB_URL found. Starting temporary in-memory database...");
            mongoServer = await MongoMemoryServer.create();
            dbUrl = mongoServer.getUri();
        }

        await mongoose.connect(dbUrl);
        console.log("✅ Connected to Database");
        
        return dbUrl;
    } catch (err) {
        console.error("❌ Database connection error:", err);
        process.exit(1);
    }
};

const closeDB = async () => {
    await mongoose.connection.close();
    if (mongoServer) {
        await mongoServer.stop();
    }
    console.log("Database connection closed.");
};

module.exports = { connectDB, closeDB };
