import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import User from '../models/user.js';

// Set up the database connection; if environment is false, it accesses the unit
// testing collection.
async function dbConnect() {
    const environment = process.env.NODE_ENV || 'production';

    if (environment === 'test') {
        return createTestDatabase();
    }

    const db = environment === 'production'
        ? process.env.DB_DEV_COLLECTION
        : process.env.DB_TEST_COLLECTION;
    const dbUri = process.env.DB_URI + db;
    const dbName = /^\/(.+)\?/.exec(db)[1];

    return await mongoose.connect(dbUri, { autoIndex: true }).then(() => {
        console.log('Connected to database ' + dbName);
    });
}

async function createTestDatabase() {
    const mongoTestServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoTestServer.getUri(), { dbName: 'test' }).then(async () => {
        console.log('Connected to database test');

        const adminUser = {
            email: process.env.TEST_ADMIN_EMAIL,
            name: 'Test Name',
            password: process.env.TEST_ADMIN_PASS_HASHED,
            emailConfirmed: true,
            emailToken: null,
            universityLocation: 'Test University',
            userType: {
                Type: process.env.ADMIN,
                Confirmed: false,
            },
            security: {
                tokens: [],
                passwordReset: {
                    token: null,
                    provisionalPassword: null,
                    expiry: null
                },
                changeEmail: {
                    token: null,
                    provisionalEmail: null,
                    expiry: null,
                },
            },
        }

        await User.create(adminUser).then(() => {
            console.log('Admin user created');
        }).catch((err) => {
            console.log('Error creating user', err);
        });
    });
}

export default dbConnect;
