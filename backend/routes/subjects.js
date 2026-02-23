const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

/* =====================================================
   GET ALL SUBJECTS
===================================================== */
router.get('/', auth, async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate('assignedTeacher', 'name email')
      .populate('grades', 'name');

    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/* =====================================================
   GET SUBJECT BY ID
===================================================== */
router.get('/:id', auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid subject ID' });
    }

    const subject = await Subject.findById(req.params.id)
      .populate('assignedTeacher', 'name email')
      .populate('grades', 'name');

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json(subject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/* =====================================================
   CREATE SUBJECT
===================================================== */
router.post(
  '/',
  auth,
  authorize('admin'),
  [
    body('name').trim().notEmpty().withMessage('Subject name is required'),
    body('description').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description } = req.body;

      let subject = await Subject.findOne({ name });
      if (subject) {
        return res.status(400).json({ message: 'Subject already exists' });
      }

      subject = new Subject({ name, description });
      await subject.save();

      const savedSubject = await Subject.findById(subject._id)
        .populate('assignedTeacher', 'name email')
        .populate('grades', 'name');

      res.status(201).json(savedSubject);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/* =====================================================
   UPDATE SUBJECT
===================================================== */
router.put(
  '/:id',
  auth,
  authorize('admin'),
  [
    body('name').optional().trim().notEmpty().withMessage('Subject name cannot be empty'),
    body('description').optional().trim()
  ],
  async (req, res) => {
    try {
      if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid subject ID' });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description, assignedTeacher } = req.body;
      const updateData = {};

      if (name) updateData.name = name;
      if (description !== undefined) updateData.description = description;

      if (assignedTeacher && assignedTeacher !== '') {
        if (!mongoose.Types.ObjectId.isValid(assignedTeacher)) {
          return res.status(400).json({ message: 'Invalid teacher ID' });
        }
        updateData.assignedTeacher = assignedTeacher;
      } else if (assignedTeacher === '') {
        updateData.assignedTeacher = null;
      }

      const subject = await Subject.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      )
        .populate('assignedTeacher', 'name email')
        .populate('grades', 'name');

      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      res.json(subject);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/* =====================================================
   DELETE SUBJECT
===================================================== */
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid subject ID' });
    }

    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/* =====================================================
   ASSIGN TEACHER TO SUBJECT
===================================================== */
router.post(
  '/:id/assign-teacher',
  auth,
  authorize('admin'),
  [body('teacherId').notEmpty().withMessage('Teacher ID is required')],
  async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid subject ID' });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { teacherId } = req.body;

      if (!mongoose.Types.ObjectId.isValid(teacherId)) {
        return res.status(400).json({ message: 'Invalid teacher ID' });
      }

      const subject = await Subject.findByIdAndUpdate(
        req.params.id,
        { assignedTeacher: teacherId },
        { new: true }
      ).populate('assignedTeacher', 'name email');

      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      res.json(subject);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;