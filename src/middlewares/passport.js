const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const UserModel = require('../db/models/user-model');
const {parseMongooseError, parseJWTError, parseLoginError} = require('../helpers/handle-errors');

require('dotenv').config();

passport.use(
  'local',
  new LocalStrategy({ usernameField: 'email', passwordField: 'password'},
  async(email, password, done) => {
    try {
        const user = await UserModel.findOne({ email, deletedAt: {$exists: false} }).populate({path: 'role', select: 'name'}).select('+password');  

      if(!user){
        const errorParse = parseLoginError({name: 'NotFound'});
        return done(null, false, errorParse);
      }
      
      const equals = await user.comparePasswords(password);
      if (!equals) { 
        const errorParse = parseLoginError({name: 'NotFound'});
        return done(null, false, errorParse);
      }

      if (user.deletedAt) { 
        const errorParse = parseLoginError({name: 'NotFound'});
        return done(null, false, errorParse);
      }

      if(!user.isActive){
        const errorParse = parseLoginError({name: 'NotActive'});
        return done(null, false, errorParse);
      }

      user.password = undefined;
      return done(null, user);
    } catch (error) {
        const errorParse = parseMongooseError(error, undefined);
        return done(errorParse);
    }
  })
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.JWT_KEY,
      jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('Bearer')
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
          const errorParse = parseJWTError(error, undefined);
          done(errorParse);
      }
    }
  )
);
