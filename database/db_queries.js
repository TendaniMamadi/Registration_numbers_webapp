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
        let exist = await db.oneOrNone('SELECT registration_number FROM registrations WHERE registration_number = $1', [registration_number]);
        let cityID =  await getCityID(registration_number)

        if (!exist) {
            await db.none(`INSERT INTO registrations (registration_number,city_id) VALUES ($1,$2)`, [registration_number,cityID.city_id]);
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
            console.log(filt);
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





/*


const clearButton = document.querySelector("#clear-btn");
clearButton.addEventListener("click", function () {
    if (confirm("Your data will be permanently deleted")) {
        regFactory.clearData();
    }
});


*/