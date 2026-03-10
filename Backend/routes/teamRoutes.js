const express = require('express');
const router = express.Router();
const {
    getTeams,
    createTeam,
    addMember,
    removeMember,
    getTeamById,
    deleteTeam
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getTeams)
    .post(protect, createTeam);

router.route('/:id')
    .get(protect, getTeamById)
    .delete(protect, deleteTeam);

router.put('/:id/add', protect, addMember);
router.put('/:id/remove', protect, removeMember);

module.exports = router;
