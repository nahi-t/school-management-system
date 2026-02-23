const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

/* =====================================================
   GET ALL USERS (Admin Only)
===================================================== */
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('assignedSubjects')
      .populate('assignedGrades')
      .populate('enrolledGrade');

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/* =====================================================
   GET ALL TEACHERS (Admin Only)
===================================================== */
router.get('/teachers', auth, authorize('admin'), async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' })
      .select('-password')
      .populate('assignedSubjects')
      .populate('assignedGrades');

    res.json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/* =====================================================
   GET ALL STUDENTS (Admin & Teacher)
===================================================== */
router.get('/students', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .populate('enrolledGrade');

    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/* =====================================================
   GET USER BY ID (Admin Only)
===================================================== */
router.get('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('assignedSubjects')
      .populate('assignedGrades')
      .populate('enrolledGrade');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/* =====================================================
   CREATE USER (Admin Only)
===================================================== */
router.post(
  '/',
  auth,
  authorize('admin'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('role')
      .isIn(['admin', 'teacher', 'student'])
      .withMessage('Valid role is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, role } = req.body;

      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      user = new User({ name, email, password, role });
      await user.save();

      const savedUser = await User.findById(user._id)
        .select('-password')
        .populate('assignedSubjects')
        .populate('assignedGrades')
        .populate('enrolledGrade');

      res.status(201).json(savedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/* =====================================================
   UPDATE USER (Admin Only)
===================================================== */
router.put(
  '/:id',
  auth,
  authorize('admin'),
  [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Name cannot be empty'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Valid email is required'),
    body('role')
      .optional()
      .isIn(['admin', 'teacher', 'student'])
      .withMessage('Valid role is required')
  ],
  async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, role } = req.body;
      const updateData = {};

      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (role) updateData.role = role;

      const user = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      )
        .select('-password')
        .populate('assignedSubjects')
        .populate('assignedGrades')
        .populate('enrolledGrade');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/* =====================================================
   DELETE USER (Admin Only)
===================================================== */
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;