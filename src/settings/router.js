const authRouter = require("../routers/auth-router");

module.exports = function (app) {

    // Routes
    app.use('/v1/auth', authRouter);
};