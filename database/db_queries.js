export default function db_queries(db) {

    async function insertRegistration(plate_number, city_id) {
        try {
            const result = await db.one(`
            INSERT INTO registration (plate_number, city_id)
            VALUES ($1, $2)
            RETURNING registration_id;
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

    async function filterRegistrationsByCity(city_name) {
        try {
            const registrations = await db.any(`
            SELECT r.*
            FROM registration r
            INNER JOIN city c ON r.city_id = c.city_id
            WHERE c.city_name = $1;
        `, [city_name]);

            return registrations;
        } catch (error) {
            throw new Error('Error filtering registrations: ' + error.message);
        }
    }

    async function deleteRegistration(registration_id) {
        try {
            await db.none('DELETE FROM registration WHERE registration_id = $1;', [registration_id]);
        } catch (error) {
            throw new Error('Error deleting registration: ' + error.message);
        }
    }


    return {
        insertRegistration,
        insertIntoRegistrationPlateNumber,
        getAllRegistrations,
        filterRegistrationsByCity,
        deleteRegistration
    }

}