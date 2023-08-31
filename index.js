import express from 'express';
import {engine} from 'express-handlebars';
import bodyParser from 'body-parser';


const app = express();

app.engine('handlebars', engine({
    layoutsDir: './views/layouts'
}));
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/',(req,res) =>{
    res.render("index")
})

const PORT =process.env.PORT || 2023;
app.listen(PORT,(req,res) =>{
    console.log('We taking off on port:',PORT)
});