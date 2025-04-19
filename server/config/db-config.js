import mongoose from 'mongoose';

// Set up the database connection; if environment is false, it accesses the unit
// testing collection.
async function dbConnect(environment) {
    const db = environment === 'production'
        ? process.env.DB_DEV_COLLECTION
        : process.env.DB_UNIT_TEST_COLLECTION;
    const dbUri = process.env.DB_URI + db;
    const dbName = /^\/(.+)\?/.exec(db)[1];

    return await mongoose.connect(dbUri, { autoIndex: true }).then(() => {
        console.log('Connected to database ' + dbName);
    });
}

export { dbConnect };
