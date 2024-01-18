const mongoose = require('mongoose');
const customObjects = require('./dbObjects');

const Applications = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    applications: [
        {
            questions: [customObjects.question],
            opportunityRecordId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            opportunityId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            status: {
                type: String,
                required: true
            },
            appliedDate: {
                type: Date,
                required: false,
            }
        }
    ]
})

module.exports = mongoose.model('application', Applications);