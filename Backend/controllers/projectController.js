const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Get all projects for the logged in user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [
                { owner: req.user.id },
                { team: req.user.id }
            ]
        });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
    try {
        const { title, name, description, status, team, progress, deadline, color } = req.body;

        const projectTitle = title || name;

        if (!projectTitle) {
            res.status(400);
            throw new Error('Please add a project name');
        }

        const project = await Project.create({
            title: projectTitle,
            name: projectTitle,
            description: description || '',
            status: status || 'Just Started',
            progress: progress || 0,
            deadline: deadline || null,
            color: color || 'var(--primary)',
            owner: req.user.id,
            team: team || 'Unassigned'
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            res.status(404);
            throw new Error('Project not found');
        }

        // Check if project belongs to user
        if (project.owner.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }

        res.status(200).json(project);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            res.status(404);
            throw new Error('Project not found');
        }

        // Check for user
        if (project.owner.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }

        const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });

        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            res.status(404);
            throw new Error('Project not found');
        }

        // Check for user
        if (project.owner.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }

        // Delete associated tasks
        await Task.deleteMany({ project: req.params.id });

        await project.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

module.exports = {
    getProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject
};
