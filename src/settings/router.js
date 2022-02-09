const authRouter = require("../routers/auth-router");
const userRouter = require("../routers/user-router");

module.exports = function (app) {

    // Routes
    app.use('/v1/auth', authRouter);
    app.use('/v1/user', userRouter);
};