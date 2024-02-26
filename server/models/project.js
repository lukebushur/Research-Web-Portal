const mongoose = require('mongoose');
const customObjects = require('./customDBObjects/questionObject');

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
            required: true,
            default: "Temporary Title"
        },
        GPA: {
            type: Number,
            double: true,
            required: false,
        },
        majors: [{
            type: String,
            required: false
        }],
        categories: [{
            type: String,
            required: false
        }],
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
                GPA: {
                    type: Number,
                    double: true,
                },
                major: [{
                    type: String,
                }],
                email: {
                    type: String
                },
                appliedDate: {
                    type: Date
                }, 
                location: {
                    type: String
                }
            }
        ],
        posted: {
            type: Date,
            required: false
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
        questions: [customObjects.question],
    }]
})

module.exports = mongoose.model('Project', researchOpp);