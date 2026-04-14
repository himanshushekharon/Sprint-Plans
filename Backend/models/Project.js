const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    id: { type: String }, // To map frontend ID if provided
    title: { type: String, required: [true, 'Please add a project title'] },
    name: { type: String }, // Alias for title
    description: { type: String },
    status: { type: String, default: 'On Track' }, // E.g., On Track, At Risk, Off Track
    progress: { type: Number, default: 0 },
    deadline: { type: String },
    team: { type: String }, // Team name like 'Design Team' or 'Team Alpha'
    budget: { type: String },
    color: { type: String, default: 'var(--primary)' },
    owner: { type: String, required: false, ref: 'User' },
    members: [{ type: String, ref: 'User' }]
}, {
    timestamps: true
    // strict: false // (optional) if we want to allow arbitrary frontend fields
});

module.exports = mongoose.model('Project', projectSchema);
