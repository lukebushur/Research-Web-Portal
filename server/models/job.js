const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  employer: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
    reuquired: true,
  },
  jobType: {
    type: String,
    required: true,
  },
  jobTimeCommitment: {
    type: String,
    required: true,
  },
  jobLocation: {
    type: String,
    required: true,
  },
  jobReqYearsExp: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Job', jobSchema);