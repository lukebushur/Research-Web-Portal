import { Schema, model } from 'mongoose';

import question from './customDBObjects/questionObject.js';

const jobSchema = new Schema({
    employer: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    isInternship: {
        type: Boolean,
        required: true,
    },
    isFullTime: {
        type: Boolean,
        required: true,
    },
    description: {
        type: String,
        reuquired: true,
    },
    location: {
        type: String,
        required: true,
    },
    reqYearsExp: {
        type: Number,
        required: true,
    },
    tags: [String],
    timeCommitment: String,
    pay: String,
    deadline: Date,
    startDate: Date,
    endDate: Date,
    datePosted: {
        type: Date,
        default: Date.now,
    },
    questions: [question],
});

const industryDataSchema = new Schema({
    jobs: {
        active: {
            type: [jobSchema],
            default: [],
        },
        draft: {
            type: [jobSchema],
            default: [],
        },
        archived: {
            type: [jobSchema],
            default: [],
        },
    },
    assessments: [{
        name: {
            type: String,
            required: true,
        },
        dateCreated: {
            type: Date,
            default: Date.now,
        },
        questions: [question],
    }],
});

export default model('IndustryData', industryDataSchema);