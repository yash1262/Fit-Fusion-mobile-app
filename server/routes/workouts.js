const express = require('express');
const {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getRecommendations,
} = require('../controllers/workoutController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getWorkouts)
  .post(protect, createWorkout);

router.get('/recommendations', protect, getRecommendations);

router.route('/:id')
  .get(protect, getWorkout)
  .put(protect, updateWorkout)
  .delete(protect, deleteWorkout);

module.exports = router;
