const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Mark = require('../models/Mark');
const User = require('../models/User');
const Subject = require('../models/Subject');
const Grade = require('../models/Grade');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

/* ===============================
   GET ALL MARKS
=============================== */
router.get('/', auth, async (req, res) => {
  try {
    let marks;

    if (req.user.role === 'student') {
      marks = await Mark.find({ student: req.user.id })
        .populate('student', 'name email')
        .populate('subject', 'name description')
        .populate('grade', 'name')
        .populate('assignedBy', 'name email');
    } else if (req.user.role === 'teacher') {
      const teacherSubjects = await Subject.find({ assignedTeacher: req.user.id });
      const subjectIds = teacherSubjects.map(s => s._id);

      marks = await Mark.find({ subject: { $in: subjectIds } })
        .populate('student', 'name email')
        .populate('subject', 'name description')
        .populate('grade', 'name')
        .populate('assignedBy', 'name email');
    } else {
      marks = await Mark.find()
        .populate('student', 'name email')
        .populate('subject', 'name description')
        .populate('grade', 'name')
        .populate('assignedBy', 'name email');
    }

    res.json(marks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ===============================
   GET MARKS BY STUDENT
=============================== */
router.get('/student/:studentId', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }

    const marks = await Mark.find({ student: studentId })
      .populate('student', 'name email')
      .populate('subject', 'name description')
      .populate('grade', 'name')
      .populate('assignedBy', 'name email');

    res.json(marks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ===============================
   GET MARKS BY SUBJECT
=============================== */
router.get('/subject/:subjectId', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { subjectId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({ message: 'Invalid subject ID' });
    }

    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    if (req.user.role === 'teacher' && (!subject.assignedTeacher || subject.assignedTeacher.toString() !== req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const marks = await Mark.find({ subject: subjectId })
      .populate('student', 'name email')
      .populate('subject', 'name description')
      .populate('grade', 'name')
      .populate('assignedBy', 'name email');

    res.json(marks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ===============================
   CREATE MARK
=============================== */
router.post('/', auth, authorize('admin', 'teacher'), [
  body('student').notEmpty().withMessage('Student ID is required'),
  body('subject').notEmpty().withMessage('Subject ID is required'),
  body('grade').notEmpty().withMessage('Grade ID is required'),
  body('marks').isInt({ min: 0, max: 100 }).withMessage('Marks must be between 0 and 100'),
  body('term').isIn(['Term 1', 'Term 2', 'Term 3', 'Final']).withMessage('Valid term is required')
], async (req, res) => {
  try {
    console.log('Mark creation request - User:', req.user);
    console.log('Mark creation request - Body:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { student, subject, grade, marks, term } = req.body;

    if (![student, subject, grade].every(mongoose.Types.ObjectId.isValid)) {
      return res.status(400).json({ message: 'Invalid student, subject, or grade ID' });
    }

    if (req.user.role === 'teacher') {
      console.log('Teacher validation - User ID:', req.user.id);
      console.log('Teacher validation - Subject ID:', subject);
      
      const subjectData = await Subject.findById(subject);
      console.log('Subject data:', subjectData);
      
      if (!subjectData || !subjectData.assignedTeacher || subjectData.assignedTeacher.toString() !== req.user.id) {
        console.log('Access denied - Teacher not assigned to subject');
        console.log('Expected teacher ID:', subjectData?.assignedTeacher?.toString());
        console.log('Actual user ID:', req.user.id);
        return res.status(403).json({ message: 'Access denied - You are not assigned to this subject' });
      }
    }

    const existingMark = await Mark.findOne({ student, subject, term });
    if (existingMark) return res.status(400).json({ message: 'Mark already exists for this student, subject, and term' });

    const mark = new Mark({ student, subject, grade, marks, term, assignedBy: req.user.id });
    await mark.save();

    const savedMark = await Mark.findById(mark._id)
      .populate('student', 'name email')
      .populate('subject', 'name description')
      .populate('grade', 'name')
      .populate('assignedBy', 'name email');

    res.status(201).json(savedMark);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ===============================
   UPDATE MARK
=============================== */
router.put('/:id', auth, authorize('admin', 'teacher'), [
  body('marks').optional().isInt({ min: 0, max: 100 }).withMessage('Marks must be between 0 and 100'),
  body('term').optional().isIn(['Term 1', 'Term 2', 'Term 3', 'Final']).withMessage('Valid term is required')
], async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid mark ID' });

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { marks, term } = req.body;
    const updateData = {};
    if (marks !== undefined) updateData.marks = marks;
    if (term) updateData.term = term;

    const existingMark = await Mark.findById(id);
    if (!existingMark) return res.status(404).json({ message: 'Mark not found' });

    if (req.user.role === 'teacher') {
      const subject = await Subject.findById(existingMark.subject);
      if (!subject || subject.assignedTeacher?.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const mark = await Mark.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate('student', 'name email')
      .populate('subject', 'name description')
      .populate('grade', 'name')
      .populate('assignedBy', 'name email');

    res.json(mark);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ===============================
   DELETE MARK
=============================== */
router.delete('/:id', auth, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid mark ID' });

    const existingMark = await Mark.findById(id);
    if (!existingMark) return res.status(404).json({ message: 'Mark not found' });

    if (req.user.role === 'teacher') {
      const subject = await Subject.findById(existingMark.subject);
      if (!subject || subject.assignedTeacher.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    await Mark.findByIdAndDelete(id);
    res.json({ message: 'Mark deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;