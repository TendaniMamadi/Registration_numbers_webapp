export default function routes(logic) {
    const homeRoute = async (req, res) => {
        const numberPlate = await logic.getAllRegistrations();
        res.render('index', { numberPlate });
    }

    const insertRoute = async (req, res) => {
        // Access the submitted data using req.body
        const registrationNumber = req.body.number;
        await logic.insertIntoRegistrationPlateNumber(registrationNumber);
        let regEx = /^(CA|CJ|ND|CY)\s?\d{1,3}\s?\d{1,3}$/i;
        if(regEx.test(registrationNumber)){
            req.flash('valid','Registration number added successfully');
        }else{
            req.flash('invalid','Invalid registration entered');
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