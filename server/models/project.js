const mongoose = require('mongoose');
const customObjects = require('./dbObjects');

const researchOpp = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    professorEmail: {
        type: String,
        required: true,
    },
    professorName: {
        type: String,
        required: true,
    },
    projects: [{
        projectName: {
            type: String,
            required: true
        },
        GPA: {
            type: Number,
            required: false,
        },
        majors:
            [{
                type: String,
                required: false
            }],
        categories: [{
            type: String,
            required: false
        }],
        professorId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        applications: [
            {
                applicationRecordID: {
                    type: mongoose.Schema.Types.ObjectId, ref: 'ApplicationRecord'
                },
                application: {
                    type: mongoose.Schema.Types.ObjectId, ref: 'Application'
                },
                status: {
                    type: String
                },
                name: {
                    type: String
                },
                gpa: {
                    type: Number
                },
                major: {
                    type: String
                },
                email: {
                    type: String
                },
                appliedDate: {
                    type: Date
                }
            }
        ],
        posted: {
            type: Date,
            required: true
        },
        deadline: {
            type: Date,
            required: false
        },
        archived: {
            type: Date,
            required: false
        },
        description: {
            type: String,
            required: true,
            default: "No description provided"
        },
        responsibilities: {
            type: String,
            required: false,
        },
        questions: [mongoose.Schema.Types.question],
    }]
})

module.exports = mongoose.model('Project', researchOpp);