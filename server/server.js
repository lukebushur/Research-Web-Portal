//  This is the main server file, it is the entry point for the backend application. The routes and database connection is set up here.

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
const generateRes = require('./helpers/generateJSON');

app.set('trust proxy', '127.0.0.1');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
require('dotenv').config();

//These objects import the routes from their respective files
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectsRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const industryRoutes = require('./routes/industryRoutes');
const adminRoutes = require('./routes/adminstrativeRoutes');
const accountManagment = require('./routes/accountManagementRoutes');
const searchRoutes = require('./routes/searchRoutes');

//These statements map the routes to endpoints, each new endpoint needs to be unique, i.e. there should not be two 
//app.use() statements with '/api', 
app.use('/api', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/industry', industryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/accountManagement', accountManagment);
app.use('/api/search', searchRoutes);

//This is a route to verify the health of the EC2 instance if deployed on AWS. It does nothing other than return success and can be
//removed without affecting the server.
app.get('/', function (req, res) {
    res.status(200).json(generateRes(true, 200, "HEALTH_CHECK_PASSED", {}));
});

//This is the 404 Route. This should remain last as it will catch all types of requests and all routes.
app.use('*', function (req, res) {
    res.status(404).json(generateRes(false, 404, "ROUTE_NOT_FOUND", {}));
});

const port = process.env.PORT || 5000;
//This code determines if the server should access the unittest collection of the mongodb server/cluster for unit testing.
//It is determined by the arguments, which the 3rd should equal 'unitTests/**/*.js' if npm test is ran. 
let noTest = true;
if (process.argv[2] === 'unitTests/**/*.js') { noTest = false; } 

//This code here sets up the database connection, if noTest is false it accesses the unit testing collection.
async function dbConnect() { 
    const db_uri = noTest ? process.env.DB_URI + process.env.DB_DEV_COLLECTION : process.env.DB_URI + process.env.DB_UNIT_TEST_COLLECTION;
    await mongoose.connect(db_uri, {
        autoIndex: true,
    }).then(() => {
        app.listen(port, () => {
            console.log('Listening on port ' + port);
        });
    }).catch((err) => {
        console.log(err);
    });
}

dbConnect();

process.on('SIGINT', () => {
    mongoose.connection.close();
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
});

module.exports = app;