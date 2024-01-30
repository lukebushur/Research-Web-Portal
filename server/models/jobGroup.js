const mongoose = require('mongoose');

const jobGroupSchema = new mongoose.Schema({
  jobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    }
  ],
  groupType: {
    type: Number // can be used to set if active/archived/draft
  },
});

module.exports = mongoose.model('JobGroup', jobGroupSchema);