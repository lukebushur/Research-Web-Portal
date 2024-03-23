const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const io = new Server(server);
const cors = require('cors')
const generateRes = require('./helpers/generateJSON');

app.set('trust proxy', '127.0.0.1');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
require('dotenv').config();

//routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectsRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const industryRoutes = require('./routes/industryRoutes');
const adminRoutes = require('./routes/adminstrativeRoutes');
const accountManagment = require('./routes/accountManagementRoutes');
const searchRoutes = require('./routes/searchRoutes');

//Endpoints
app.use('/api', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/industry', industryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/accountManagement', accountManagment);
app.use('/api/search', searchRoutes);

//This is the 404 Route. THIS MUST REMAIN LAST IT CATCHES ALL OTHER REQUESTS 
app.use('*', function (req, res) {
    res.status(404).json(generateRes(false, 404, "ROUTE_NOT_FOUND", {}));
});

const port = process.env.PORT || 5000;

let noTest = true;
if (process.argv[2] === 'unitTests/**/*.js') { noTest = false; }

async function dbConnect() {
    const db_uri = noTest ? process.env.DB_URI + process.env.DB_DEV_COLLECTION : process.env.DB_URI + process.env.DB_UNIT_TEST_COLLECTION;
    await mongoose.connect(db_uri, {
        autoIndex: true,
    }).then(() => {
        server.listen(port, () => {
            console.log('Listening on port ' + port);
        })
    }).catch((err) => {
        console.log(err);
    });
}

io.on('connection', (socket) => {
    console.log('CONNECTED LMAO');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

dbConnect();

process.on('SIGINT', () => {
    mongoose.connection.close();
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
});

module.exports = app;