const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    id: { type: String }, // To map frontend ID if provided
    title: { type: String, required: [true, 'Please add a task title'] },
    description: { type: String, required: [true, 'Please add a description'] },
    status: { type: String, default: 'todo' }, // todo, in progress, review, done
    priority: { type: String, default: 'Medium' }, // Low, Medium, High
    tag: { type: String, default: 'Task' }, // Design, Backend, UI, Bug
    deadline: { type: String }, // Optional, like "Dec 20"
    completedAt: { type: Date },
    project: { type: String }, // Storing project name string for frontend compatibility, or ObjectId
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }, // actual db rel
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assigneeAvatar: { type: String } // Avatar string or object
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
