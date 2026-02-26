const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a team name']
    },
    membersList: [{
        name: String,
        email: String,
        role: String
    }],
    assignedProjects: [{
        type: String
    }],
    color: {
        type: String,
        default: '#8b5cf6'
    },
    status: {
        type: String,
        default: 'Active'
    },
    members: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Team', teamSchema);
