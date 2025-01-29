import { Schema, model } from 'mongoose';

import question from './customDBObjects/questionObject.js';

const Applications = new Schema({
    user: {
        type: String,
        required: true,
    },
    applications: [
        {
            questions: [question],
            opportunityRecordId: {
                type: Schema.Types.ObjectId,
                required: true
            },
            opportunityId: {
                type: Schema.Types.ObjectId,
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
});

export default model('application', Applications);