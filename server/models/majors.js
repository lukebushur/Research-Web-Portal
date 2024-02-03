const mongoose = require('mongoose');

const majorsRecord = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    majors: [{
        type: String,
    }]
})

module.exports = mongoose.model('Majors', majorsRecord);