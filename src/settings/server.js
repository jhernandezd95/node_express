const router = require('./router');

require('dotenv').config();


module.exports = (app) => {

    // Settings
    app.set("port", process.env.PORT);

    router(app);

    return app;
}