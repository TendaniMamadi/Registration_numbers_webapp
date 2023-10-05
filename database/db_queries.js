export default function db_queries(db) {

    async function getCityID(registration_number) {
        try {
            let firstTwoLettersOfTheRegNumber = registration_number.substring(0, 2).toUpperCase();
            const result = await db.oneOrNone(`SELECT city_id FROM cities WHERE city_code = $1`, [firstTwoLettersOfTheRegNumber])
            if (result != null) {
                return result;
            } else {
                return null
            }
        } catch (error) {
            throw new Error('City ID for registration entered is not supported: ' + error.message);
        }

    }


    async function insertIntoRegistrationPlateNumber(registration_number) {
        registration_number = registration_number.toUpperCase()
        let exist = await db.oneOrNone('SELECT registration_number FROM registrations WHERE registration_number = $1', [registration_number]);
        let cityID = await getCityID(registration_number)


        if (!exist && cityID !== null) {
            await db.none(`INSERT INTO registrations (registration_number,city_id) VALUES ($1,$2)`, [registration_number, cityID.city_id]);
        }
    }

    // Function to check for duplicates in the database
    async function alreadyExistInDatabase(registration_number) {
        let exist = await db.oneOrNone('SELECT registration_number FROM registrations WHERE registration_number = $1', [registration_number]);
        return exist
    }


    //displays everything that has been inserted
    async function getAllRegistrations() {
        let registrations;
        registrations = await db.manyOrNone('SELECT registration_number FROM registrations');
        return registrations;
    }


    //filter by city 
    async function filterRegistrationsByCity(city) {
        if (city) {
            const query = `SELECT registration_number FROM registrations WHERE city_id = $1`
            let selectedCity = await getCityID(city);


            let filt = await db.any(query, [selectedCity.city_id]);

            return (filt);
        } else {
            const allQuery = 'SELECT registration_number FROM registrations';
            return await db.any(allQuery);
        }
    }


    //Remove the datafrom database
    async function deleteRegistrations() {
        try {
            await db.none('DELETE FROM registrations');
        } catch (error) {
            throw error;
        }
    }


    return {
        insertIntoRegistrationPlateNumber,
        getAllRegistrations,
        filterRegistrationsByCity,
        getCityID,
        deleteRegistrations,
        alreadyExistInDatabase
    }

}




