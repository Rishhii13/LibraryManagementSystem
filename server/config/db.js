const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const ATLAS_URI =
      "mongodb+srv://2024rishililani_db_user:e5YEzRSpwKMwpbgj@librarymanagementdb.h6zogr3.mongodb.net/?appName=LibraryManagementDB";

    await mongoose.connect(ATLAS_URI, {
      dbName: "library_management",
    });

    console.log("MongoDB Atlas connected successfully");
  } catch (error) {
    console.error("MongoDB Atlas connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;