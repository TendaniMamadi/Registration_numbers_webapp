export default function db_queries(db) {

    //inserts the plate number
    // async function insertIntoRegistrationPlateNumber(plate_number,city_id) {
    //     try {
    //         const result = await db.none(`
    //         INSERT INTO registration (plate_number,city_id)
    //         VALUES ($1,$2)
    //     `, [plate_number,city_id]);

    //         return result;

    //     } catch (error) {
    //         throw new Error('Error inserting registration: ' + error.message);
    //     }
    // }

    async function insertIntoRegistrationPlateNumber(registration_number,city_id) {
    
        try {
            const result = await db.none(`
                INSERT INTO registrations (registration_number,city_id)
                VALUES ($1,$2)
            `, [registration_number,city_id]);

            return result;
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

    // async function filterRegistrationsByCity(selectedCity) {
    //     try {
    //         const filteredRegistrations = await db.any('SELECT city_id FROM city WHERE city_code = $1', [selectedCity]);
    //         return filteredRegistrations;
    //     } catch (error) {
    //         throw error;
    //     }
    // }


    //selects the city_id 
    async function filterRegistrationsByCity(selectedCity) {
        if (selectedCity) {
            const query = `
            SELECT r.registration_id, r.registration_number, c.city_code, c.city FROM registrations r INNER JOIN cities c ON r.city_id = c.city_id;`;
            return await db.any(query, [selectedCity]);
        } else {
            const allQuery = 'SELECT registration_number FROM registrations';
            return await db.any(allQuery);
        }
    }


    // async function filterCity(city_code) {
    //     try {
    //         const filteredRegistrations = await db.any('SELECT registration.plate_number FROM registration JOIN city ON registration.city_id = city.city_id WHERE city_code = $1;', [city_code]);
    //         return filteredRegistrations;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    // async function filterCity(city_code) {
    //     try {
    //         const filteredRegistrations = await db.any('SELECT plate_number FROM registration JOIN city ON registration.city_id = city.city_id WHERE city_code = $1;', [city_code]);
    //         return filteredRegistrations;
    //     } catch (error) {
    //         throw error;
    //     }
    // }




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
        //filterCity,
        deleteRegistrations
    }

}