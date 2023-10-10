const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authController = require('./controllers/authenicate')

app.use(express.json());

//routes
const authRoutes = require('./routes/auth');

//Endpoints
app.use('/api', authRoutes);

require('dotenv').config();
const port = process.env.PORT || 4001;

mongoose.connect(`${process.env.DB_PROTOCOL}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?${process.env.DB_PARAMS}`,
    {
        autoIndex: true,
    }).then(() => {
        app.listen(port, () => {
            console.log('Listening on port ' + port);
        })
    }).catch((err) => {
        console.log(err);
    });

process.on('SIGINT', () => {
    mongoose.connection.close();
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
});

