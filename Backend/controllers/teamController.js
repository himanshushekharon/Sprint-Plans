const Team = require('../models/Team');

// @desc    Get all teams created by user
// @route   GET /api/teams
// @access  Private
const getTeams = async (req, res) => {
    try {
        const teams = await Team.find({
            $or: [
                { createdBy: req.user.id },
                { members: req.user.id }
            ]
        }).populate('members', 'name email');
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
        const { name, members } = req.body;

        if (!name) {
            res.status(400);
            throw new Error('Please add a team name');
        }

        const team = await Team.create({
            name,
            members: members || [],
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
        const { userId } = req.body;
        const team = await Team.findById(req.params.id);

        if (!team) {
            res.status(404);
            throw new Error('Team not found');
        }

        if (team.createdBy.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }

        if (!team.members.includes(userId)) {
            team.members.push(userId);
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
        const { userId } = req.body;
        const team = await Team.findById(req.params.id);

        if (!team) {
            res.status(404);
            throw new Error('Team not found');
        }

        if (team.createdBy.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }

        team.members = team.members.filter(m => m.toString() !== userId);
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
        const team = await Team.findById(req.params.id).populate('members', 'name email');

        if (!team) {
            res.status(404);
            throw new Error('Team not found');
        }

        res.status(200).json(team);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

module.exports = {
    getTeams,
    createTeam,
    addMember,
    removeMember,
    getTeamById
};
