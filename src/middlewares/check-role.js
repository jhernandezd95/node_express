const {parseUnauthorizedError} = require('../helpers/handle-errors');

module.exports = checkRole = (roles) => {
    return (req, res, next) => {
        if (roles.includes(req.user.role)) {
            next();
        } else {
            const errorParse = parseUnauthorizedError({url: req.originalUrl, method: req.method, email: req.user.email}, req);
            res.status(errorParse.code).send(errorParse);
        }
    }
}