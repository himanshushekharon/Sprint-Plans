const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get tasks by project id
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasksByProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project || (project.owner.toString() !== req.user.id && !project.team.includes(req.user.id))) {
            res.status(401);
            throw new Error('User not authorized or project not found');
        }

        const tasks = await Task.find({ project: req.params.projectId });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
    try {
        const { title, description, status, dueDate, project, assignedTo } = req.body;

        if (!title || !description || !project) {
            res.status(400);
            throw new Error('Please add title, description and project');
        }

        // Verify project ownership
        const parentProject = await Project.findById(project);
        if (!parentProject || parentProject.owner.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized or project not found');
        }

        const task = await Task.create({
            title,
            description,
            status,
            dueDate,
            project,
            assignedTo
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('project');

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        // Check project ownership
        if (task.project.owner.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('project');

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        // Check project ownership
        if (task.project.owner.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }

        await task.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

module.exports = {
    getTasksByProject,
    createTask,
    updateTask,
    deleteTask
};
