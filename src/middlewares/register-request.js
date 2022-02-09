const {createLog} = require('../helpers/winston');

module.exports = () => (req, res, next) => {
    createLog('info', '', req);
    next();
}