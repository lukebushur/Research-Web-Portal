const mongoose = require('mongoose');
const customObjects = require('./customDBObjects/questionObject');

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
            },
            lastModified: {
                type: Date,
                required: true,
            },
            lastUpdated: {
                type: Date,
            }
        }
    ]
})

module.exports = mongoose.model('application', Applications);