const ItemModel = require('../db/models/item-model');
const {parseMongooseError} = require('../helpers/handle-errors');

const _filterParams = (params) => {
    const filter = {};
    Object.entries(params).forEach(([key, value]) => {
      switch(key){
        case 'general': filter.$or = [
            {name: {$regex: `${value.toLowerCase()}`, "$options": "i"}},
            {description: {$regex: `${value.toLowerCase()}`, "$options": "i"}},
            {keywords: {$regex: `${value.toLowerCase()}`, "$options": "i"}},
        ]; break
        case 'gtprice': filter.price = {$gt: value}; break
        case 'ltprice': filter.price = {$lt: value}; break
        default: filter[key] = value; break;
      } // key - value
    })

    return filter;
}

async function create (req, res) {        
    try {
        req.body.owner = req.body.owner? req.body.owner : req.user.id;
        const item = await ItemModel.create(req.body);
        res.status(200).send(item);
    } catch (error) {
        const errorParse = parseMongooseError(error, req);
        res.status(errorParse.code).send(errorParse);                
    }               
}

async function getAll(req, res) {
    try {
        const skip = req.query.skip? Number(req.query.skip) : 0;
        const limit = req.query.limit? Number(req.query.limit) : Number.MAX_SAFE_INTEGER;
        const sort = req.query.sort? req.query.sort : 'createdAt';
        const filter = _filterParams(req.query);
        const result = await ItemModel.find(filter)
                                .skip(skip)
                                .limit(limit)
                                .sort(sort);
        const total = await ItemModel.countDocuments({});
        const totalMatched = await ItemModel.countDocuments(filter);
        res.status(200).send({products: result, length: totalMatched, total});    
    } catch (error) {
        const errorParse = parseMongooseError(error, req);
        res.status(errorParse.code).send(errorParse);
    }
}

async function getFromOwner(req, res) {
    try {
        const skip = req.query.skip? Number(req.query.skip) : 0;
        const limit = req.query.limit? Number(req.query.limit) : Number.MAX_SAFE_INTEGER;
        const sort = req.query.sort? req.query.sort : 'createdAt';
        req.query.owner = req.user.id;
        const filter = _filterParams(req.query);
        const result = await ItemModel.find(filter)
                                .skip(skip)
                                .limit(limit)
                                .sort(sort);
        const total = await ItemModel.countDocuments({});
        const totalMatched = await ItemModel.countDocuments(filter);
        res.status(200).send({products: result, length: totalMatched, total});    
    } catch (error) {
        const errorParse = parseMongooseError(error, req);
        res.status(errorParse.code).send(errorParse);
    }
}

module.exports = {
    create,
    getAll,
    getFromOwner
}