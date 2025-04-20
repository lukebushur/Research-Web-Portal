// This is the main server file; it is the entry point for the back-end application.
// The routes and database connection are set up here.

import express from 'express';
const app = express();
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';

import getTransporter from './config/email-config.js';

//These objects import the routes from their respective files
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectsRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import industryRoutes from './routes/industryRoutes.js';
import adminRoutes from './routes/adminstrativeRoutes.js';
import accountManagment from './routes/accountManagementRoutes.js';
import searchRoutes from './routes/searchRoutes.js';

import generateRes from './helpers/generateJSON.js';
import dbConnect from './config/db-config.js';

app.set('trust proxy', '127.0.0.1');
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const mailTransport = getTransporter();
app.set('transport', mailTransport);

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

await dbConnect().then(() => {
    app.listen(port, () => {
        console.log('Listening on port ' + port);
    });
}).catch((err) => {
    console.log('Error connecting to database', err);
});

process.on('SIGINT', () => {
    mongoose.connection.close();
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
});

export default app;
