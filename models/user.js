const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        min: 6,
        max: 25
    },
    name: {
        type: String,
        required: true,
        min: 2,
        max: 25,
    },
    password: {
        type: String,
        required: true,
        min: 10,
        max: 255
    },
    emailConfirmed: {
        type: Boolean,
        required: true,
        default: true
    },
    userType: {
        Type: {
            type: Number, 
            required: true,
            default: 0
            // 0 is student 
            // 1 is faculty
            // 2 is industry
            // >3 is admin
        },
        Confirmed: {
            type: Boolean,
            default: false
        },
        FacultyProjects: {  
            Archived: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ProjectGroup'
            },
            Active: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ProjectGroup'
            },
            Draft: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ProjectGroup'
            }
        },
        StudentProjects: {
            Rejected: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ProjectGroup'
            },
            Pending: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ProjectGroup'
            },
            Accepted: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ProjectGroup'
            }
        }
    },
    emailToken: {
        type: String
    },
    security: {
        tokens: [{
            refreshToken: String,
            createdAt: Date
        }],
        passwordReset: {
            token: {
                type: String,
                default: null
            },
            provisionalPassword: {
                type: String,
                default: null
            },
            expiry: {
                type: Date,
                default: null
            },
        },
        changeEmail: {
            token: {
                type: String,
                default: null
            },
            provisionalEmail: {
                type: String,
                default: null,
            },
            expiry: {
                type: String,
                default: null,
            },
        }
    }
})

module.exports = mongoose.model('User', userSchema);