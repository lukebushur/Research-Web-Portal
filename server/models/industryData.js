const mongoose = require('mongoose');
const customObjects = require('./customDBObjects/questionObject');

const jobSchema = new mongoose.Schema({
  employer: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  isInternship: {
    type: Boolean,
    required: true,
  },
  isFullTime: {
    type: Boolean,
    required: true,
  },
  description: {
    type: String,
    reuquired: true,
  },
  location: {
    type: String,
    required: true,
  },
  reqYearsExp: {
    type: Number,
    required: true,
  },
  tags: [String],
  timeCommitment: String,
  pay: String,
  deadline: Date,
  startDate: Date,
  endDate: Date,
  datePosted: {
    type: Date,
    default: Date.now,
  },
  questions: [customObjects.question],
});

const industryDataSchema = new mongoose.Schema({
  jobs: {
    active: {
      type: [jobSchema],
      default: [],
    },
    draft: {
      type: [jobSchema],
      default: [],
    },
    archived: {
      type: [jobSchema],
      default: [],
    },
  },
  assessments: [{
    name: {
      type: String,
      required: true,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    questions: [customObjects.question],
  }],
});

module.exports = mongoose.model('IndustryData', industryDataSchema);