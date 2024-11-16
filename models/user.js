const mongoose = require('mongoose');

mongoose.connect(`mongodb://127.0.0.1:27017/mohsin`);

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    age: Number,
    profilepic: {
        type: String,
        default: "default.png"
    },
}) 
module.exports = mongoose.model("user", userSchema);