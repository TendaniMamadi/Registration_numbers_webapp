export default function db_queries(db) {

    async function insertRegistration(plate_number, city_id) {
        try {
            const result = await db.one(`
            INSERT INTO registration (plate_number, city_id)
            VALUES ($1, $2)
        `, [plate_number, city_id]);

            return result.registration_id;
        } catch (error) {
            throw new Error('Error inserting registration: ' + error.message);
        }
    }


    async function insertIntoRegistrationPlateNumber(plate_number) {
        try {
            const result = await db.none(`
            INSERT INTO registration (plate_number)
            VALUES ($1)
        `, [plate_number]);

            return result;

        } catch (error) {
            throw new Error('Error inserting registration: ' + error.message);
        }
    }

    async function getAllRegistrations() {
        try {
            const registrations = await db.any('SELECT plate_number FROM registration;');
            return registrations;

        } catch (error) {
            throw new Error('Error getting registrations: ' + error.message);
        }
    }


    async function filterRegistrationsByCity(selectedCity) {
        try {
            const filteredRegistrations = await db.any('SELECT * FROM registration WHERE plate_number = $1', [selectedCity]);
            return filteredRegistrations;
        } catch (error) {
            throw error;
        }
    }



    async function deleteRegistrations() {
        try {
            await db.none('DELETE FROM registration');
        } catch (error) {
            throw error;
        }
    }



    return {
        insertRegistration,
        insertIntoRegistrationPlateNumber,
        getAllRegistrations,
        filterRegistrationsByCity,
        deleteRegistrations
    }

}