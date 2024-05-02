const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    priority: String,
    dueDate: Date,
    tags: Array
});

const task = mongoose.model('tasks', taskSchema);

module.exports = task;