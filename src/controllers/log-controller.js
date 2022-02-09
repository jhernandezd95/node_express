const LogModel = require('../db/models/log-model');
const {parseMongooseError} = require('../helpers/handle-errors');

const _filterParams = (params) => {
    const filter = {};
    Object.entries(params).forEach(([key, value]) => {
      switch(key){
        case 'ip': filter['meta.ip'] = {$regex: `${value.toLowerCase()}`, "$options": "i"}; break
        case 'browser': filter['meta.browser'] = {$regex: `${value.toLowerCase()}`, "$options": "i"}; break
        case 'method': filter['meta.method'] = {$regex: `${value.toLowerCase()}`, "$options": "i"}; break
        case 'user': filter['meta.user'] = {$regex: `${value.toLowerCase()}`, "$options": "i"}; break
        case 'requestId': filter['meta.requestId'] = {$regex: `${value.toLowerCase()}`, "$options": "i"}; break
        case 'from': filter.timestamp = {$gt: value}; break
        case 'until': filter.timestamp = {$lt: value}; break
        default: break;
      } // key - value
    })

    filter.deletedAt = { $exists: false };

    return filter;
}

async function getAll(req, res) {

    const skip = req.query.skip? Number(req.query.skip) : 0;
    const limit = req.query.limit? Number(req.query.limit) : Number.MAX_SAFE_INTEGER;
    const sort = req.query.sort? req.query.sort : 'createdAt';
    const filter = _filterParams(req.query);
    try {
        const result = await LogModel.find(filter)
                                .skip(skip)
                                .limit(limit)
                                .sort(sort);
        const total = await LogModel.countDocuments({deletedAt: { $exists: false }});
        const totalMatched = await LogModel.countDocuments(filter);
        res.status(200).send({logs: result, length: totalMatched, total});
    } catch (error) {
        const errorParse = parseMongooseError(error, req);
        res.status(errorParse.code).send(errorParse);
    }
}

module.exports = {getAll}