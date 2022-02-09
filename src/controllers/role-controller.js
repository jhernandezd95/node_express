const RoleModel = require('../db/models/role-model');
const {parseMongooseError} = require('../helpers/handle-errors');

async function getAll(req, res){
    try {
        const roles = await RoleModel.find({});
        res.status(200).send(roles);
    } catch (error) {
        const errorParse = parseMongooseError(error, req)
        res.status(errorParse.code).send(errorParse);
    }
}

module.exports = {
    getAll
}