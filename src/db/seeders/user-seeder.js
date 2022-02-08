const User = require('../models/user-model');
const Role = require('../models/role-model');
const parseMongooseError = require('../../helpers/handle-errors');

Role.findOne({name: 'Admin'}, (roleError, role) => {

    if(roleError){
        parseMongooseError(roleError, undefined)
    }

    const item = {
        firstname: 'Admin',
        lastname: 'Admin',
        email: 'admin@example.com', 
        password: 'root123*', 
        isActive: true,
        role: role._id
    };
    
    User.findOne({email: item.email}, (userError, res) => {
        if(userError){
            parseMongooseError(userError, undefined)
        }
        else if(res === null)
            new User(item).save();
    })
})
