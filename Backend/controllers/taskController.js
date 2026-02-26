const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get tasks by project id
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasksByProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            res.status(404);
            throw new Error('Project not found');
        }

        // Skip strict auth for now since teams/members logic is frontend heavy
        // or check owner/members array instead of .team string
        if (project.owner && project.owner.toString() !== req.user.id && (!project.members || !project.members.includes(req.user.id))) {
            res.status(401);
            throw new Error('User not authorized to view tasks for this project');
        }

        const tasks = await Task.find({ projectId: req.params.projectId });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, deadline, dueDate, project, assignedTo, progress } = req.body;

        if (!title || !project) {
            res.status(400);
            throw new Error('Please add title and project');
        }

        // Verify project ownership
        const parentProject = await Project.findById(project);
        if (!parentProject || parentProject.owner.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized or project not found');
        }

        let calculatedProgress = progress || 0;
        if (progress === undefined) {
            if (status === 'Completed') calculatedProgress = 100;
            else if (status === 'In Progress') calculatedProgress = 50;
        }

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            deadline: deadline || dueDate,
            project: parentProject.name,
            projectId: project,
            member: assignedTo, // mapping frontend string into member field
            progress: calculatedProgress
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('projectId');

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        // Check project ownership via populated projectId
        if (task.projectId && task.projectId.owner.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('projectId');

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        // Check project ownership via populated projectId
        if (task.projectId && task.projectId.owner.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }

        await task.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

module.exports = {
    getTasksByProject,
    createTask,
    updateTask,
    deleteTask
};
