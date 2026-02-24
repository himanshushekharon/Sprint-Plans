const express = require('express');
const router = express.Router();
const {
    getTeams,
    createTeam,
    addMember,
    removeMember,
    getTeamById
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getTeams)
    .post(protect, createTeam);

router.route('/:id')
    .get(protect, getTeamById);

router.put('/:id/add', protect, addMember);
router.put('/:id/remove', protect, removeMember);

module.exports = router;
