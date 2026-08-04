const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set. Please add it to Backend/.env");
    return false;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log("Connected to MongoDB");
    return true;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    console.error(
      "Check that the Atlas cluster is reachable, your IP is whitelisted, and the MONGO_URI is correct."
    );
    return false;
  }
};

module.exports = connectDB;