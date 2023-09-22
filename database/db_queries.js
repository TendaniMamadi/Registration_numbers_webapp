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

        //valid formats: CA123123
        // Convert the entered registration number to lowercase for case insensitivity
        let normalizedInput = registration_number.toLowerCase();
        // Check if the normalized input exists in the array of registration numbers
        if (registration_number.includes(normalizedInput)) {
            // If it exists, send an error message
            return "reg number already exists";
        } else {

                //if above condition is false, insert registration


            //
            let regEx = /^(CA|CJ|ND|CY)\s?\d{1,3}\s?\d{1,3}$/i
                ;

            // Check if the registration_number matches the regex pattern
            if (regEx.test(registration_number)) {
                try {
                    let city_id = await getCityID(registration_number);
                    if (city_id) {
                        await db.none(`INSERT INTO registrations (registration_number, city_id) VALUES ($1, $2)`, [registration_number, city_id.city_id]);
                    }
                } catch (error) {
                    throw new Error('Error inserting registration: ' + error.message);
                }
            } else {
                // Handle the case where the registration_number doesn't match the regex pattern
                let message = "Invalid registration number format"
                return message
            }
        }
    }

    //displays everything that has been inserted

    async function getAllRegistrations() {
        let registrations;

        try {
            registrations = await db.manyOrNone('SELECT registration_number FROM registrations');


        } catch (error) {
            throw error
        }

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

    //functions that picks up duplication of data

    // function avoidDuplications(registration_number) {
    //     // // Convert the entered registration number to lowercase for case insensitivity
    //     // let normalizedInput = registration_number.toLowerCase();



    //     if (registration_number) {
    //         // Check if the normalized input exists in the array of registration numbers
    //         if (registration_number.includes(normalizedInput)) {
    //             // If it exists, send an error message
    //             return "reg number already exists";
    //         }
    //     }

    //     // If no duplicate is detected, add registration.

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
        getCityID,
        deleteRegistrations,
        // avoidDuplications
    }

}