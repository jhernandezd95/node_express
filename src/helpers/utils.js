const bcrypt = require("bcrypt");

function makeid(length) {
    const result = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i+=1 ) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
   }
   return result.join('');
}

function hashPassword(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

module.exports = {
    makeid,
    hashPassword
}