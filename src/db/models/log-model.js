const mongoose = require('mongoose');
const {Schema} = mongoose;

const LogModel = new Schema(
    {
        timestamp: Date,
        level: String,
        message: String,
        meta: {
            ip: String,
            browser: String,
            method: String,
            url: String,
            user: String,
            requestId: String,
            timestamp: Date
        }
        
    }
);

module.exports = mongoose.model('log', LogModel);