const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then((e) => console.log("MongoDb connected"));

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
module.exports = mongoose.model("user", userSchema);
