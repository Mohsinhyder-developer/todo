const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: { type: String, required: true },
    isImportant: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const TaskModel = mongoose.model('Task', taskSchema);
module.exports = TaskModel;
