const express = require('express');
const exphbs = require('express-handlebars');

require('dotenv').config();

const app = express();
const port = process.env.PORT;

// Parsing middleware
app.use(express.urlencoded({extended: true}));

// Parse application/json
app.use(express.json());

// Static Files
app.use(express.static('public'));

// Templating engine
const handlebars = exphbs.create({ extname: '.hbs',});
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');


const routes = require('./server/routes');
app.use('/', routes);

app.listen(port, () => console.log(`Listening on port ${port} => http://localhost:${port}/`));