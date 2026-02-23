const express = require('express');
const { body, validationResult } = require('express-validator');
const Grade = require('../models/Grade');
const User = require('../models/User');
const Subject = require('../models/Subject');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const grades = await Grade.find()
      .populate('assignedTeacher', 'name email')
      .populate('students', 'name email')
      .populate('subjects', 'name description');
    res.json(grades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id)
      .populate('assignedTeacher', 'name email')
      .populate('students', 'name email')
      .populate('subjects', 'name description');
    
    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }
    
    res.json(grade);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, authorize('admin'), [
  body('name').trim().notEmpty().withMessage('Grade name is required'),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    let grade = await Grade.findOne({ name });
    if (grade) {
      return res.status(400).json({ message: 'Grade already exists' });
    }

    grade = new Grade({ name, description });
    await grade.save();

    const savedGrade = await Grade.findById(grade._id)
      .populate('assignedTeacher', 'name email')
      .populate('students', 'name email')
      .populate('subjects', 'name description');

    res.status(201).json(savedGrade);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, authorize('admin'), [
  body('name').optional().trim().notEmpty().withMessage('Grade name cannot be empty'),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, assignedTeacher } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (assignedTeacher) updateData.assignedTeacher = assignedTeacher;

    const grade = await Grade.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('assignedTeacher', 'name email')
     .populate('students', 'name email')
     .populate('subjects', 'name description');

    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    res.json(grade);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const grade = await Grade.findByIdAndDelete(req.params.id);
    
    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    res.json({ message: 'Grade deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/assign-teacher', auth, authorize('admin'), [
  body('teacherId').notEmpty().withMessage('Teacher ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { teacherId } = req.body;

    const grade = await Grade.findByIdAndUpdate(
      req.params.id,
      { assignedTeacher: teacherId },
      { new: true }
    ).populate('assignedTeacher', 'name email');

    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    res.json(grade);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/add-student', auth, authorize('admin'), [
  body('studentId').notEmpty().withMessage('Student ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { studentId } = req.body;

    const grade = await Grade.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { students: studentId } },
      { new: true }
    ).populate('students', 'name email');

    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    await User.findByIdAndUpdate(studentId, { enrolledGrade: req.params.id });

    res.json(grade);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/add-subject', auth, authorize('admin'), [
  body('subjectId').notEmpty().withMessage('Subject ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { subjectId } = req.body;

    const grade = await Grade.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { subjects: subjectId } },
      { new: true }
    ).populate('subjects', 'name description');

    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    await Subject.findByIdAndUpdate(subjectId, { $addToSet: { grades: req.params.id } });

    res.json(grade);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
