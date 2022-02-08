const mongoose = require('mongoose');

const {Schema} = mongoose;

const RoleModel = new Schema(
    {
        name: String,
    }, { timestamps: true }
);

module.exports = mongoose.model('role', RoleModel);