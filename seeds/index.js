if (process.env.NODE_ENV != "production") {
    require("dotenv").config({ path: "../.env" });
}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/Listing.js");
const User = require("../models/User.js");
const { connectDB, closeDB } = require("../config/database");

const initDB = async () => {
    try {
        await connectDB();
        
        // Find or create a dummy user
        let dummyUser = await User.findOne({ username: "dummy_owner" });
        if (!dummyUser) {
            const newUser = new User({ email: "dummy@example.com", username: "dummy_owner" });
            dummyUser = await User.register(newUser, "password123");
        }

        await Listing.deleteMany({});
        
        initData.data = initData.data.map((obj) => ({
            ...obj,
            owner: dummyUser._id,
        }));
        
        await Listing.insertMany(initData.data);
        console.log("✅ Data was initialized successfully");
        
    } catch(err) {
        console.error("❌ Initialization failed", err);
    } finally {
        await closeDB();
    }
};

initDB();