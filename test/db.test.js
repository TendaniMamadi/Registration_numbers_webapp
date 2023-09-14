import assert from 'assert'
import db_queries from '../database/db_queries.js';
import pgPromise from 'pg-promise';
import 'dotenv/config';

const pgp = pgPromise();
const DATABASE_URL = process.env.DATABASE_URL_TEST

const config = {
    connectionString: DATABASE_URL
}

if (process.env.NODE_ENV == 'production') {
    config.ssl = {
        rejectUnauthorized: false
    }
}
const db = pgp(config);

//test cases
describe('db_queries Module', function () {
    this.timeout(20000);
    let dbQueries = db_queries(db)
    // Before running tests, initialize the test database and create the "greetedNames" table
    beforeEach(async function () {
        try {
            // clean the tables before each test run
            await db.none("TRUNCATE TABLE registrations RESTART IDENTITY CASCADE;");
        } catch (err) {
            console.log(err);
            throw err;
        }
    });


    it('should be able to catch duplicates', async function () {
        // Insert a registration plate into the database
        await dbQueries.insertIntoRegistrationPlateNumber('CA 230303');
    
        // Attempt to insert the same registration plate, which should fail
        try {
            await dbQueries.insertIntoRegistrationPlateNumber('CA 230303');
            assert.fail('Registration number already exist.');
        } catch (error) {
            assert.deepEqual(error.message, 'Registration number already exist.');
        }
    });
    

    it('should retrieve filtered city', async function () {
        // Insert registration plates into the database
        await dbQueries.insertIntoRegistrationPlateNumber('CA 230303');
        await dbQueries.insertIntoRegistrationPlateNumber('CY 230303');
    
        // Retrieve registrations for a specific city
        const registrations = await dbQueries.getCityID('CY');
        assert.deepEqual(registrations.length, 1);
    });
    

    it('should send error messages', async function () {
        // Attempt to insert an invalid registration plate
        try {
            await dbQueries.insertIntoRegistrationPlateNumber('BT 32 XN GP');
            assert.fail('Enter valid registration.');
        } catch (error) {
            assert.deepEqual(error.message, 'Enter valid registration.');
        }
    });
    


    it('should clear the database', async function () {
        // Insert registration plates into the database
        await dbQueries.insertIntoRegistrationPlateNumber('CY 230303');
        await dbQueries.insertIntoRegistrationPlateNumber('CY 123456');
    
        // Clear the database
        await dbQueries.deleteRegistrations();
    
        // Verify that the database is empty
        const registrations = await dbQueries.getAllRegistrations();
        assert.deepEqual(registrations.length, 0);
    });
    
    after(function () {
        db.$pool.end
    })
});
