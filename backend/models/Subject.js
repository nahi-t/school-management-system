const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  assignedTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  grades: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grade'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Subject', subjectSchema);
