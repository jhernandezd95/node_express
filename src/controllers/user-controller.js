const UserModel = require('../db/models/user-model');
const {parseMongooseError} = require('../helpers/handle-errors');

const _updateParams = (params) => {
    const filter = {};
    Object.entries(params).forEach(([key, value]) => {
      switch(key){
        case 'firstname': filter[key] = value; break
        case 'lastname': filter[key] = value; break
        case 'email': filter[key] = value; break
        default: break;
      } // key - value
    })
    return filter;
}

const _filterParams = (params) => {
    const filter = {};
    Object.entries(params).forEach(([key, value]) => {
      switch(key){
        case 'general': filter.$or = [
            {firstname: {$regex: `${value.toLowerCase()}`, "$options": "i"}},
            {lastname: {$regex: `${value.toLowerCase()}`, "$options": "i"}},
            {email: {$regex: `${value.toLowerCase()}`, "$options": "i"}},
        ]; break
        case 'email': filter[key] = {$regex: `${value.toLowerCase()}`, "$options": "i"}; break
        case 'role': filter[key] = value; break
        default: break;
      } // key - value
    })

    return filter;
}

async function create (req, res) {
        try {
            req.body.isActive = true;
            await UserModel.create(req.body);
            res.status(200).send({message: 'User created.'});   
        } catch (error) {
            const errorParse = parseMongooseError(error, req);
            res.status(errorParse.code).send(errorParse);
        }
}

async function update(req, res){
    try {
        const params = _updateParams(req.body);
        const id = req.params.id? req.params.id : req.user.id;
        const user = await UserModel.findOneAndUpdate({_id: id}, {$set: params}, {new: true});
        if(!user){
            const errorParse = parseMongooseError({name: 'NotModified'}, req);
            res.status(errorParse.code).send(errorParse);
        } else {
            res.status(200).send(user);
        }
    } catch (error) {
        const errorParse = parseMongooseError(error, req)
        res.status(errorParse.code).send(errorParse);
    }
}

async function changeRole(req, res){
    try {
        const result = await UserModel.updateOne(
            {_id: req.params.id},
            {role: req.body.role});
        if(result.modifiedCount === 0){
            const errorParse = parseMongooseError({name: 'NotModified'}, req);
            res.status(errorParse.code).send(errorParse);
        } else {
            res.status(200).send({message: 'Updated successfully.'});
        }
        
    } catch (error) {
        const errorParse = parseMongooseError(error, req)
        res.status(errorParse.code).send(errorParse);
    }
}

async function changeStatus(req, res){
    try {
        const user = await UserModel.findOne({_id: req.params.id});
        if(!user){
            const errorParse = parseMongooseError({name: 'NotFound'}, req)
            res.status(errorParse.code).send(errorParse);
        } else {
            const status = !user.isActive;
            await UserModel.updateOne({_id: user.id}, {$set: {isActive: status}});
            res.status(200).send({message: 'Updated successfully.'})
        }
    } catch (error) {
        const errorParse = parseMongooseError(error, req)
        res.status(errorParse.code).send(errorParse);
    }
}

async function getAll(req, res){
    try {
        const skip = req.query.skip? Number(req.query.skip) : 0;
        const limit = req.query.limit? Number(req.query.limit) : Number.MAX_SAFE_INTEGER;
        const sort = req.query.sort? req.query.sort : 'createdAt';
        const filter = _filterParams(req.query);
        const result = await UserModel.find(filter)
                                .populate('role')
                                .skip(skip)
                                .limit(limit)
                                .sort(sort);
        const total = await UserModel.countDocuments({});
        const totalMatched = await UserModel.countDocuments(filter);
        res.status(200).send({users: result, length: totalMatched, total});
    } catch (error) {
        const errorParse = parseMongooseError(error, req)
        res.status(errorParse.code).send(errorParse);
    }
}

async function remove(req, res){
    try {
        const _id = req.params.id? req.params.id : req.user.id;
        await UserModel.findOneAndUpdate({_id: _id}, {$set: {deletedAt: new Date}});
        res.status(200).send({message: "The item was deleted successfully."});
    } catch (error) {
        const errorParse = parseMongooseError(error, req)
        res.status(errorParse.code).send(errorParse);
    }
}

module.exports = {
    create,
    update,
    changeRole,
    changeStatus,
    getAll,
    remove
}