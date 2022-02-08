const router = require('./router');

require('dotenv').config();
require('../db');

module.exports = (app) => {

    // Settings
    app.set("port", process.env.PORT);

    router(app);

    return app;
}