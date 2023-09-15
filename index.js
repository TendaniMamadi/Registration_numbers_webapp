import express from 'express';
import { engine } from 'express-handlebars';
import bodyParser from 'body-parser';
import flash from 'express-flash';
import session from 'express-session';
import db_Queries from './database/db_queries.js';
import registrationApp from './factory function/registrationApp.js';
import pgPromise from 'pg-promise';
import 'dotenv/config';
const DATABASE_URL = process.env.DATABASE_URL

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
const backendInstance = db_Queries(db)
const registrationInstance = registrationApp(backendInstance);
const routeInstance = (registrationInstance,backendInstance);


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
    res.render('index', { numberPlate });
});

//Registration route (POST)
app.post('/', async (req, res) => {

    // Access the submitted data using req.body
    const registrationNumber = req.body.number;
  //  const select = req.body.city;
    await backendInstance.insertIntoRegistrationPlateNumber(registrationNumber);
    res.redirect('/');

});

// Filter route (POST)
app.post('/filter', async (req, res) => {
    const selectedCity = req.body.city;
    const filteredPlates = await backendInstance.filterRegistrationsByCity(selectedCity);
    res.render('index', {filteredPlates});
  
});

// Clear database route (POST)
app.post('/clear', async (req, res) => {
    await backendInstance.deleteRegistrations();
    req.flash('alrt','Database successfully cleared!');
    res.redirect('/');
});



const PORT = process.env.PORT || 3034;
app.listen(PORT, (req, res) => {
    console.log('We taking off on port:', PORT)
});


