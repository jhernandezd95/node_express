const mongoose = require('mongoose');
const {createLog} = require("../helpers/winston");
const {parseMongooseError} = require('../helpers/handle-errors');
require('dotenv').config();

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const DATABSE_URI = process.env.MONGODB_URI.replace('password', encodeURIComponent(process.env.MONGODB_PASSWORD));

mongoose.connect(DATABSE_URI, options)
    // eslint-disable-next-line no-unused-vars
    .then( (db) => {
        require('./seeders')
        createLog('info', 'Connection has been established successfully.', undefined);
    }).catch(error => {
        parseMongooseError(error);
    })
