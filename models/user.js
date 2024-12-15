const mongoose = require("mongoose");

// Check if MONGO_URI is defined
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in the environment variables");
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define the User schema
const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  age: Number,
  profilepic: {
    type: String,
    default: "default.png",
  },
});

// Export the User model
module.exports = mongoose.model("user", userSchema);
