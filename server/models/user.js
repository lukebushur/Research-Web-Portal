const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        min: 6,
        max: 254
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
    emailConfirmed: { //This determiens if the user has confirmed their email, unconfirmed emails cannot make valid requests 
        type: Boolean,
        required: true,
        default: true
    },
    universityLocation: { //This universityLocation should be associated with a record in the database which holds a list of majors.
        type: String,     //Students of a particular university can only have majors that are associated with the university named in this field
        default: "Purdue University Fort Wayne"
    },
    userType: { //This field holds information regarding the user's account type
        Type: { //The Type field determien what type the user is, determined in the .env file for Faculty as well as Student
            type: Number, 
            required: true,
            default: 0
        },
        Confirmed: { //This is an unimplemented field that determines if the faculty account (if faculty) is confirmed by an admin
            type: Boolean,
            default: false
        },
        FacultyProjects: { //This field holds the mongoDB ids for 3 other project records, the active, draft, and archived. These are the faculty's 
            Archived: {    //active, draft, and archived project lists
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
        studentApplications: { //This field holds the mongoDB id for the applications record (if the account type is a student account)
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Applications'
        },
        GPA: {
            type: Number,
            double: true,
        },
        Major: [{
            type: String,
            required: false
        }],
        industryData: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'IndustryData',
        },
    },
    emailToken: { //Email token holds the token that will be used to confirm the email of the user. Generally sent through an email link
        type: String
    },
    security: { //This field holds information that is used for account authentication and modification.
        tokens: [{ //This array holds an array of refresh tokens and dates, which are used to regenerate access tokens for accounts if the refresh token is not expired
            refreshToken: String,
            createdAt: Date
        }],
        passwordReset: { //This field holds information needed to reset a password
            token: { //This token is the password reset token, and is need to reset a password
                type: String,
                default: null
            },
            expiry: { //Used to check if the reset password window has expired
                type: Date,
                default: null
            },
        },
        changeEmail: { //This field holds information needed to change an email
            token: { //Token for changing the email
                type: String,
                default: null
            },
            provisionalEmail: { //This is the new email that will be changed if the token can be provided
                type: String,
                default: null,
            },
            expiry: { //used to check if the change email window has expired
                type: String,
                default: null,
            },
        }
    }
})

module.exports = mongoose.model('User', userSchema);