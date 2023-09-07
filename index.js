import express from 'express';
import { engine } from 'express-handlebars';
import bodyParser from 'body-parser';
import flash from 'express-flash';
import session from 'express-session';
import registrationApp from './factory function/registrationApp.js';
import pgPromise from 'pg-promise';
import backend from './database/db_queries.js'


const DATABASE_URL = process.env.DATABASE_URL || 'postgres://vlciqtnc:bSO8NB8PbLYnE4QiLBeWH80GuUXwVwQD@trumpet.db.elephantsql.com/vlciqtnc?ssl=true'

const config = {
    connectionString: DATABASE_URL
}

if (process.env.NODE_ENV == 'production') {
    config.ssl = {
        rejectUnauthorized: false
    }
}
const pgp = pgPromise();
const db = pgp(config);
const app = express();
const backendInstance = backend(db)
const registrationInstance = registrationApp(backendInstance);


app.engine('handlebars', engine({
    layoutsDir: './views/layouts'
}));
app.use(session({
    secret: "Registration app",
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());


// Index route
app.get('/', async (req, res) => {
    const numberPlate = await backendInstance.getAllRegistrations();
   //console.log(numberPlate);
    res.render('index',{numberPlate});
});

//Registration route (POST)
app.post('/', async (req, res) => {
    // Access the submitted data using req.body
    const registrationNumber = req.body.number;
    const filteredRegistrations = await backendInstance.filterRegistrationsByCity(registrationInstance.getCode(registrationNumber));
    const filters = await backendInstance.insertIntoRegistrationPlateNumber(registrationNumber);
 
    
    //console.log(filters);
   
    res.redirect('/');
    
});
// app.post('/', async (req, res) => {
//     const registrationNumber = req.body.number;
//     const code = registrationInstance.getCode(registrationNumber);

//     // Assuming filterRegistrationsByCity returns an array of filtered registrations
//     const filteredRegistrations = await backendInstance.filterRegistrationsByCity(code);

//     // Insert each matching registration number individually
//     for (const registration of filteredRegistrations) {
//         await backendInstance.insertIntoRegistrationPlateNumber(registrationNumber, registration.id);
//     }

//     res.redirect('/');
// });


// Filter route (POST)
app.post('/filter', async (req, res) => {
    const selectedCity = req.body.city;
    const registration_number = req.body.registration_number;
    const city_id = req.body.city_id;

    const filteredPlates = await backendInstance.filterRegistrationsByCity(backendInstance.insertIntoRegistrationPlateNumber(registration_number,city_id));
    res.render('index', {selectedCity});
    console.log(selectedCity);
});
// app.post('/filter', async (req, res) => {
//     const selectedCity = req.body.city;

//     // Assuming addCity returns the code based on the selected city
//     const code = registrationInstance.addCity(selectedCity);

//     // Assuming filterCity returns filtered results based on the city code
//     const cityFilter = await backendInstance.filterCity(code);

//     console.log(cityFilter);
//     res.render('index', { cityFilter });
// });



// Clear database route (POST)
app.post('/clear', async (req, res) => {
    await backendInstance.deleteRegistrations();
    req.flash('clr', 'All registrations have been deleted.');
    res.redirect('/');
});



const PORT = process.env.PORT || 3033;
app.listen(PORT, (req, res) => {
    console.log('We taking off on port:', PORT)
});


