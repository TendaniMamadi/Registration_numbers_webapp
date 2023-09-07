export default function db_queries(db) {

    async function getCityID(registration_number) {
        try {
            let firstTwoLettersOfTheRegNumber = registration_number.substring(0, 2);
            const result = await db.oneOrNone(`SELECT city_id FROM cities WHERE city_code = $1`, [firstTwoLettersOfTheRegNumber])
            if (result != null) {

                return result;
            } else {
                return
            }
        } catch (error) {
            throw new Error('Error inserting registration: ' + error.message);
        }

    }

    async function insertIntoRegistrationPlateNumber(registration_number) {

        try {
            let city_id = await getCityID(registration_number)
            if (city_id) {

                await db.none(`INSERT INTO registrations (registration_number, city_id) VALUES ($1,$2)`, [registration_number, city_id.city_id]);
            }
        } catch (error) {
            throw new Error('Error inserting registration: ' + error.message);
        }
    }

    //displays everything that has been inserted

    async function getAllRegistrations() {
        try {
            const registrations = await db.any('SELECT registration_number FROM registrations;');
            return registrations;

        } catch (error) {
            throw new Error('Error getting registrations: ' + error.message);
        }
    }

    

    //filter by city 
    async function filterRegistrationsByCity(city) {
        if (city) {
            const query =`SELECT registration_number FROM registrations WHERE city_id = $1`
            let selectedCity = await getCityID(city);
            let filt = await db.any(query, [selectedCity.city_id]);
            return(filt);
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
        deleteRegistrations
    }

}