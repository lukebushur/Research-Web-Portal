import { Schema, model } from 'mongoose';

const majorsRecord = new Schema({
    location: {
        type: String,
        required: true,
        unqiue: true,
    },
    majors: [{
        type: String,
    }]
});

export default model('Majors', majorsRecord);