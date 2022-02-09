const mongoose = require('mongoose');
const {Schema} = mongoose;
const UserModel = require('./user-model');

const ItemModel = new Schema(
    {
        name: {type: String, required: true},
        description: {type: String, required: true},
        price: {
            type: Number,
            required: true,
            min: [0, 'Must be greater than 0, got {VALUE}'],
        },
        keywords: {type: [String], required: false},
        deletedAt: { type: Date, expires: '730001h'},
        owner: {type: Schema.Types.ObjectId, ref: 'user'},
    }, { timestamps: true }
);

const typesFindQueryMiddleware = [
    'count',
    'find',
    'findOne',
    'findOneAndDelete',
    'findOneAndRemove',
    'findOneAndUpdate',
    'update',
    'updateOne',
    'updateMany',
    'countDocuments'
];
  
const excludeInFindQueriesIsDeleted = async function (next) {
    this.where({ deletedAt: { $exists: false } });
    next();
};
  
typesFindQueryMiddleware.forEach((type) => {
    ItemModel.pre(type, excludeInFindQueriesIsDeleted);
});
  
const excludeInDeletedInAggregateMiddleware = async function (next) {
    this.pipeline().unshift({ $match: {  deletedAt: { $exists: false } } });
    next();
};
  
ItemModel.pre('aggregate', excludeInDeletedInAggregateMiddleware);

// Check if role id exist
ItemModel.path('owner').validate(async (value) => {
    const count = await UserModel.countDocuments({_id: value});
    return count === 1
  }, 'This owner does not exist');

module.exports = mongoose.model('item', ItemModel);