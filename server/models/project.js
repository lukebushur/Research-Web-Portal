const mongoose = require('mongoose');

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
                }
            }
        ],
        posted: {
            type: Date,
            required: true
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
        questions: [String],
        requirements: [
            { requirementType: Number, requirementValue: String, required: Boolean }
        ]
    }]
})

module.exports = mongoose.model('Project', researchOpp);