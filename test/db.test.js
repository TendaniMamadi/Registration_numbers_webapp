import assert from 'assert'
import db_queries from '../database/db_queries.js';
import FrontEndLogic from '../services/registrationApp.js';
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
        await dbQueries.insertIntoRegistrationPlateNumber('CJ 242424');
        await dbQueries.insertIntoRegistrationPlateNumber('CY 242424');
        await dbQueries.insertIntoRegistrationPlateNumber('ND 242424');
        const registrations = await dbQueries.getAllRegistrations();


        assert.deepEqual([
            {
                "registration_number": "CA 242424"
            },
            {
                "registration_number": "CJ 242424"
            },
            {
                "registration_number": "CY 242424"
            },
            {
                "registration_number": "ND 242424"
            }
        ], registrations);

    });



    it('should be able to catch duplicates', async function () {
        // Insert a registration plate into the database
        await dbQueries.insertIntoRegistrationPlateNumber('CA 230303');

        // Attempt to insert the same registration plate, which should fail
        try {
            await dbQueries.alreadyExistInDatabase('CA 230303');
        } catch (error) {
            assert.strictEqual(error.message, 'Registration number already exists.');
        }
    });



    it('should retrieve filtered city', async function () {
        // Retrieve registrations for a specific city

        await dbQueries.insertIntoRegistrationPlateNumber('CA 242424');
        await dbQueries.insertIntoRegistrationPlateNumber('CJ 242424');
        await dbQueries.insertIntoRegistrationPlateNumber('CY 242424');
        await dbQueries.insertIntoRegistrationPlateNumber('ND 242424');

        const registrations = await dbQueries.filterRegistrationsByCity("CA");
        assert.strictEqual(1, registrations.length);

    });



    it('should send error messages', async function () {
        // Attempt to insert an invalid registration plate
        let front = FrontEndLogic();
        front.errorMessage('BT 32 XN GP');
        front.errorMessage('City ID for registration entered is not supported.');
        assert.equal('Enter valid registration.', front.errorMessage());

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
