export default function routes(frontendInstance, logic) {
    const homeRoute = async (req, res) => {
        const numberPlate = await logic.getAllRegistrations();
        res.render('index', { numberPlate });
    }

    const insertRoute = async (req, res) => {
        // Access input data using req.body
        const registrationNumber = req.body.number;
        let reg = registrationNumber.substring(2)

        if (reg.length >= 5) {
            let regEx = frontendInstance.errorMessage(registrationNumber);
            let catchingDuplicates = await logic.alreadyExistInDatabase(registrationNumber);

            if (!regEx) {
                if (catchingDuplicates) {
                    req.flash('alreadyExists', 'Registration entered already exists');
                } else {
                    if (await logic.getCityID(registrationNumber) == null) {

                        req.flash('notValid', 'Registration entered is not supported');

                    } else {

                        await logic.insertIntoRegistrationPlateNumber(registrationNumber);
                        req.flash('valid', 'Registration number added successfully');
                    }
                }

            }
        } else {
            req.flash('notValid', 'Reg Too short');

        }



        res.redirect('/');
    }

    const filterRoute = async (req, res) => {
        const selectedCity = req.body.city;
        const filteredPlates = await logic.filterRegistrationsByCity(selectedCity);

        if (filteredPlates == '') {
            req.flash('notValid', 'No registration for selected city')
        }
        res.render('index', { filteredPlates });
    }

    const clearingRoute = async (req, res) => {
        await logic.deleteRegistrations();
        req.flash('alrt', 'Database successfully cleared!');
        res.redirect('/');
    }

    return {
        homeRoute,
        insertRoute,
        filterRoute,
        clearingRoute
    }
}






// const insertRoute = async (req, res) => {
//     // Access input data using req.body
//     const registrationNumber = req.body.number;
//     let reg = registrationNumber.substring(2)

//     if (reg.length >= 5) {
//         req.flash('notValid', 'Reg Too short');
//     }


//     let catchingDuplicates = await logic.alreadyExistInDatabase(registrationNumber);
//     if (catchingDuplicates) {
//         req.flash('alreadyExists', 'Registration entered already exists');
//     }

//     let regEx = frontendInstance.errorMessage(registrationNumber);
//     if (!regEx) {
//         if (await logic.getCityID(registrationNumber) == null) {

//             req.flash('notValid', 'Registration entered is not supported');

//         } else {

//             await logic.insertIntoRegistrationPlateNumber(registrationNumber);
//             req.flash('valid', 'Registration number added successfully');
//         }
//     }




//     res.redirect('/');
// }