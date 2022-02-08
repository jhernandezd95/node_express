const mongoose = require('mongoose');
const {Schema} = mongoose;

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
    }, { timestamps: true }
);

module.exports = mongoose.model('item', ItemModel);