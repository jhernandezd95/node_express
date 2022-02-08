const mongoose = require('mongoose');
const Role = require('../models/role-model');

const roles = [{name:'Admin'}, {name:'Bussines'}, {name:'Client'}];

roles.forEach(item => {
    Role.findOne(item).then( (res) => {
        if(res === null)
            new Role(item).save();
    })
})  