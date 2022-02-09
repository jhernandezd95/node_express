const express = require("express");
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const addRequestId = require('express-request-id')();
const router = require('./router');

require('dotenv').config();
require('../middlewares/passport');
require('../db');

module.exports = (app) => {

    // Settings
    app.set("port", process.env.PORT);

    // Middlewares
    app.use(express.json({limit: '4mb'}));
    app.use(express.urlencoded({limit: '4mb', extended: false}));
    app.use(cors());
    app.use(addRequestId);

    router(app);

    return app;
}