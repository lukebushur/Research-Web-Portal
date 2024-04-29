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

const jobProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  skillsAssessed: {
    type: String,
    required: true,
  },
  eta: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  materials: {
    type: [String],
    required: false,
  },
  submissionType: {
    type: String,
    required: true,
  },
  fileTypes: {
    type: [String],
    required: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
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
  jobProjects: {
    type: [jobProjectSchema],
    default: [],
  },
});

module.exports = mongoose.model('IndustryData', industryDataSchema);