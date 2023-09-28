export default function routes(frontendInstance, logic) {
    const homeRoute = async (req, res) => {
        const numberPlate = await logic.getAllRegistrations();
        res.render('index', { numberPlate });
    }

    const insertRoute = async (req, res) => {
        // Access input data using req.body
        const registrationNumber = req.body.number;

        let regEx = frontendInstance.errorMessage(registrationNumber);
        let catchingDuplicates = await logic.alreadyExistInDatabase(registrationNumber);

        if (!regEx) {
            if (catchingDuplicates) {
                req.flash('alreadyExists', 'Registration entered already exists');
            } else {
                await logic.insertIntoRegistrationPlateNumber(registrationNumber);
                req.flash('valid', 'Registration number added successfully');
            }

        } else {
            req.flash('notValid', 'Invalid registration entered');
        }


        res.redirect('/');
    }

    const filterRoute = async (req, res) => {
        const selectedCity = req.body.city;
        const filteredPlates = await logic.filterRegistrationsByCity(selectedCity);
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