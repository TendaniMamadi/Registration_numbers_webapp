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
//const registrationInstance = registrationApp(backendInstance);


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
    req.flash('clr', 'All registrations have been deleted.');
    res.redirect('/');
});



const PORT = process.env.PORT || 3034;
app.listen(PORT, (req, res) => {
    console.log('We taking off on port:', PORT)
});


