const express = require('express');
const router = express.Router();
const {
    getTasksByProject,
    createTask,
    updateTask,
    deleteTask
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createTask);

router.get('/project/:projectId', protect, getTasksByProject);

router.route('/:id')
    .put(protect, updateTask)
    .delete(protect, deleteTask);

module.exports = router;
