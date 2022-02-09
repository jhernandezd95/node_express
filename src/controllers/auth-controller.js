const jwt = require('jsonwebtoken');
const passport = require('passport');
const UserModel = require('../db/models/user-model');
const RoleModel = require('../db/models/role-model');
const sendEmail = require('../helpers/nodemailer');
const {makeid} = require('../helpers/utils');
const {parseMongooseError} = require('../helpers/handle-errors');

async function signup (req, res) {
        try {
            const code = makeid(6);
            req.body.code = code;

            const role = await RoleModel.findOne({name: 'Client'});
            req.body.role = role.id;
            
            const user = await UserModel.create(req.body);

            const fullName = user.getFullName();
            sendEmail(user.email, {fullName, code}, 1, req);
            res.status(200).send({message: 'User created.'});   
        } catch (error) {
            const errorParse = parseMongooseError(error, req);
            res.status(errorParse.code).send(errorParse);
        }
}

/**
 * 
 * Active an user given a token.
 */
async function verifyCode(req, res) {
    try{
      const user = await UserModel.updateOne(
        {code: req.body.code, deletedAt: {$exists: false}}, 
        {$set: {code: undefined, isActive: true}});
      if(user.matchedCount === 0){
        const errorParse = parseMongooseError({name: 'NotFound'}, req);
        res.status(errorParse.code).send(errorParse);
      } else {
        res.status(200).send({message : `Email was verified`});
      }
    } catch(error){
        const errorParse = parseMongooseError(error, req);
        res.status(errorParse.code).send(errorParse);
    }
}

/**
 * 
 * Using email and password fields for log into the app. 
 */
 async function login (req, res, next) {
    passport.authenticate(
      'local',
      async (err, user, info) => {
        try {
          if (err || !user) {
            info.requestId = req.id;
            return res.status(info.code).send(info);
          }
  
          req.login(
            user,
            { session: false },
            (error) => {
              if (error) return next(error);
  
              const fullName = user.getFullName();
              const body = { id: user.id, fullName, email: user.email, role: user.role.name };
              try {
                const token = jwt.sign({ user: body }, process.env.JWT_KEY, {expiresIn: '48h'});
                const today = new Date();
                try {
                    UserModel.updateOne({_id: user._id}, {lastLogin: today})
                    return res.json({ user, token }); 
                } catch (error) {
                    const errorParse = parseSequelizeErrors(error, req);
                    res.status(errorParse.code).send(errorParse);
                } 
              } catch (error) {
                  const errorParse = parseJWTError(error, req);
                  res.status(errorParse.code).send(errorParse);
              }
            }
          );
        } catch (error) {
          return next(error);
        }
      }
    )(req, res, next);
}

module.exports = {
    signup,
    verifyCode,
    login
}