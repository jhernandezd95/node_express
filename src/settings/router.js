const authRouter = require("../routers/auth-router");
const userRouter = require("../routers/user-router");
const adminRouter = require("../routers/admin-router");
const businessRouter = require("../routers/business-router");
const clientRouter = require("../routers/client-router");

module.exports = function (app) {

    // Routes
    app.use('/v1/auth', authRouter);
    app.use('/v1/user', userRouter);
    app.use('/v1/admin', adminRouter);
    app.use('/v1/business', businessRouter);
    app.use('/v1/client', clientRouter);
};