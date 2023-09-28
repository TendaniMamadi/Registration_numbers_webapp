import assert from 'assert'
import db_queries from '../database/db_queries.js';
import pgPromise from 'pg-promise';
import 'dotenv/config';

const pgp = pgPromise({});
const connectionString = process.env.DATABASE_URL_TEST

const db = pgp(connectionString);

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


    it('should be able add registration number to database', async function () {
        // Insert a registration plate into the database

        await dbQueries.insertIntoRegistrationPlateNumber('CA 242424');
        const registrations = await dbQueries.getAllRegistrations();


        assert.deepEqual([{ registration_number: 'CA 242424' }], registrations);

    });



    it('should be able to catch duplicates', async function () {
        // Insert a registration plate into the database
        await dbQueries.insertIntoRegistrationPlateNumber('CA 230303');

        // Attempt to insert the same registration plate, which should fail
        try {
            await dbQueries.alreadyExistInDatabase('CA 230303');
            assert.fail('Registration number already exists.'); // Fail the test if no error is thrown
        } catch (error) {
            assert.strictEqual(error.message, 'Registration number already exists.');
        }
    });



    it('should retrieve filtered city', async function () {
        // Retrieve registrations for a specific city
        const registrations = await dbQueries.filterRegistrationsByCity("CA");
        assert.strictEqual(0, registrations.length);

    });



    // it('should send error messages', async function () {
    //     // Attempt to insert an invalid registration plate
    //     try {
    //         await dbQueries.insertIntoRegistrationPlateNumber('BT 32 XN GP');
    //         assert.fail('Invalid registration entered.');
    //     } catch (error) {
    //         assert.deepEqual(error.message, 'Invalid registration entered.');
    //     }
    // });



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
