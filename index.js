import express from 'express';
import {engine} from 'express-handlebars';
import bodyParser from 'body-parser';
import flash from 'express-flash';
import session from 'express-session';
import registrationApp from './services/registrationApp.js';
import pgPromise from 'pg-promise';

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
const regInstance = registrationApp(db);

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
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Routes
app.get('/', async (req, res) => {
    // Fetch all registrations from the database
    await regInstance.getRegistrationPlates();
    res.render('index');
  });
  
  app.post('/add', async (req, res) => {
    const {number, code,towns_id} = req.body;
  
    // Save the registration to the database
    await regInstance.addRegistrationPlate({ number, code,towns_id });
  
    res.redirect('/');
  });
  
  app.post('/filter', async (req, res) => {
    const selectedCity = req.body.city;
  
    // Fetch registrations filtered by city
    await regInstance.filterByCity({ city: selectedCity });
  
    res.render('index');
  });

const PORT =process.env.PORT || 2023;
app.listen(PORT,(req,res) =>{
    console.log('We taking off on port:',PORT)
});