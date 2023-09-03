export default function RegistrationApp(db) {
    const plates = [];

    // In registrationApp.js or a separate module
    async function addRegistrationPlate({ number, code,towns_id }) {
        try {
            await db.none('INSERT INTO registrationnumber (number, code,towns_id ) VALUES ($1, $2, $3)', [number, code,towns_id ]);
        } catch (error) {
            throw error;
        }
    }


    // In registrationApp.js or a separate module
    async function getRegistrationPlates() {
        try {
            const plates = await db.any('SELECT * FROM registrationnumber');
            return plates;
        } catch (error) {
            throw error;
        }
    }


    // In registrationApp.js or a separate module
    async function filterByCity({ city }) {
        try {
            const filteredPlates = await db.any('SELECT names FROM registrationnumber WHERE towns_id = $1', [towns_id]);
            return filteredPlates;
        } catch (error) {
            throw error;
        }
    }


    return {
        addRegistrationPlate,
        getRegistrationPlates,
        filterByCity,
    };
}
