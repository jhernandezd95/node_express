const mongoose = require('mongoose');
const {Schema} = mongoose;
const uniqueValidator = require('mongoose-unique-validator');
const RoleModel = require('./role-model');
const {hashPassword} = require('../../helpers/utils');
const bcrypt = require('bcrypt');

require('dotenv').config();

const UserModel = new Schema(
  {
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, select: false, required: true, minlength: 8, maxlength: 20},
    isActive: {type: Boolean, default: false},
    code: {type: String, select: false, required: false},
    lastLogin: {type: Date},
    role: {type: Schema.Types.ObjectId, ref: 'role'},
    deletedAt: { type: Date, expires: '730001h'},
  },
  { timestamps: true }
);

UserModel.pre('save', function(next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();
  
  user.password = hashPassword(user.password);
  next();
});

// Check if passwords matches
UserModel.methods.comparePasswords = async function(password) {
  const user = this;
  try {
    const compare = await bcrypt.compare(password, user.password);
    return compare; 
  } catch (error) {
      return false
  }
};

UserModel.methods.getFullName = function() {
  const self = this;
  return self.firstname + ' ' + self.lastname;
};

// Validate email address
UserModel.path('email').validate((value) => {
  // eslint-disable-next-line no-useless-escape
  const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return re.test(String(value).toLowerCase());
}, 'Email is invalid');

// Check if role id exist
UserModel.path('role').validate(async (value) => {
  const count = await RoleModel.countDocuments({_id: value});
  return count === 1
}, 'This role does not exist');

UserModel.plugin(uniqueValidator)

module.exports = mongoose.model('user', UserModel);