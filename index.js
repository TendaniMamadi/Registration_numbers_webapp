import express from 'express';
import { engine } from 'express-handlebars';
import bodyParser from 'body-parser';
import flash from 'express-flash';
import session from 'express-session';
import db_queries from './database/db_queries.js';
import pgPromise from 'pg-promise';
import 'dotenv/config';
import routes from './routes/routes.js';
import FrontEndLogic from './services/registrationApp.js';

const app = express();
const connectionString = process.env.DATABASE_URL
const pgp = pgPromise({});
const db = pgp(connectionString);
const frontendInstance = FrontEndLogic();
const backendInstance = db_queries(db)
const routeInstance = routes(frontendInstance,backendInstance);


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
app.get('/', routeInstance.homeRoute);

//Registration route (POST)
app.post('/', routeInstance.insertRoute);

// Filter route (POST)
app.post('/filter',routeInstance.filterRoute);

// Clear database route (POST)
app.post('/clear',routeInstance.clearingRoute);

//PORT
const PORT = process.env.PORT || 3035;
app.listen(PORT, (req, res) => {
    console.log('We taking off on port:', PORT)
});


