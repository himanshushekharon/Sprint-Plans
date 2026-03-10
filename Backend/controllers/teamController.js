const Team = require('../models/Team');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Get all teams created by user
// @route   GET /api/teams
// @access  Private
const getTeams = async (req, res) => {
    try {
        const teams = await Team.find({
            createdBy: req.user.id
        });
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private
const createTeam = async (req, res) => {
    try {
        const { name, membersList, assignedProjects, color, status } = req.body;

        if (!name) {
            res.status(400);
            throw new Error('Please add a team name');
        }

        const team = await Team.create({
            name,
            membersList: membersList || [],
            assignedProjects: assignedProjects || [],
            color: color || '#8b5cf6',
            status: status || 'Active',
            members: membersList ? membersList.length : 0,
            createdBy: req.user.id
        });

        res.status(201).json(team);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Add member to team
// @route   PUT /api/teams/:id/add
// @access  Private
const addMember = async (req, res) => {
    try {
        const { name, email, role, projects } = req.body;
        const team = await Team.findById(req.params.id);

        if (!team) {
            res.status(404);
            throw new Error('Team not found');
        }

        if (team.createdBy.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }

        // Add member to membersList if not already present by email
        const existingMember = team.membersList.find(m => m.email === email);
        if (!existingMember && email) {
            team.membersList.push({ name: name || email.split('@')[0], email, role: role || 'Developer' });
            team.members = team.membersList.length;

            // Add assigned projects if any
            if (projects && Array.isArray(projects)) {
                projects.forEach(p => {
                    if (!team.assignedProjects.includes(p)) {
                        team.assignedProjects.push(p);
                    }
                });
            }

            await team.save();
        }

        res.status(200).json(team);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Remove member from team
// @route   PUT /api/teams/:id/remove
// @access  Private
const removeMember = async (req, res) => {
    try {
        const { userId } = req.body; // userId is passed as name or email from frontend
        const team = await Team.findById(req.params.id);

        if (!team) {
            res.status(404);
            throw new Error('Team not found');
        }

        if (team.createdBy.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }

        team.membersList = team.membersList.filter(m => m.name !== userId && m.email !== userId && m._id?.toString() !== userId);
        team.members = team.membersList.length;
        await team.save();

        res.status(200).json(team);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Get team details
// @route   GET /api/teams/:id
// @access  Private
const getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            res.status(404);
            throw new Error('Team not found');
        }

        res.status(200).json(team);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Private
const deleteTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            res.status(404);
            throw new Error('Team not found');
        }

        if (team.createdBy.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }

        // Optional: Cascade delete projects and tasks for this team
        // Find projects by team name (as it's stored as a string in Project model)
        const teamProjects = await Project.find({ team: team.name });
        const projectIds = teamProjects.map(p => p._id);

        if (projectIds.length > 0) {
            await Task.deleteMany({ project: { $in: projectIds } });
            await Project.deleteMany({ _id: { $in: projectIds } });
        }

        await team.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

module.exports = {
    getTeams,
    createTeam,
    addMember,
    removeMember,
    getTeamById,
    deleteTeam
};
