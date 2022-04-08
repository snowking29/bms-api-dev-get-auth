require('dotenv').config({ path: './.env' });
require('./api/database/database');

const express = require('express');
const morgan = require('morgan');
const cors = require("cors");

const app = express();

// Routes
const authRoutes = require ("./api/routes/auth.routes");


// Settings
app.use(cors());
app.set('port', process.env.PORT || 4000);

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//routes
app.use('/api/auth',authRoutes)

//Starting the server
const main = () => {
    app.listen(app.get('port'), () => {
        console.log(`Server initialize on port ${app.get('port')}`)
    })
}

main();


