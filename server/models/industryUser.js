const mongoose = require('mongoose');

const industryUserSchema = mongoose.Schema({
  jobs: {
    active: {
      type: mongoose.Types.ObjectId,
      ref: 'JobGroup',
    },
    draft: {
      type: mongoose.Types.ObjectId,
      ref: 'JobGroup',
    },
    archived: {
      type: mongoose.Types.ObjectId,
      ref: 'JobGroup',
    },
  },
});

module.exports = mongoose.model('IndustryUser', industryUserSchema);