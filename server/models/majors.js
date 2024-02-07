const mongoose = require('mongoose');

const majorsRecord = new mongoose.Schema({
    location: {
        type: String,
        required: true,
        unqiue: true,
    },
    majors: [{
        type: String,
    }]
})

module.exports = mongoose.model('Majors', majorsRecord);