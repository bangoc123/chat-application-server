/* eslint-disable import/prefer-default-export */
import { Strategy, ExtractJwt } from 'passport-jwt';
import { config, underscoreId } from './global';
import { User } from './db/models';

export const applyPassportStrategy = (passport) => {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.passport.secret;
  passport.use(new Strategy(opts, (payload, done) => {
    User.findOne({ username: payload.username }, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, {
          username: user.username,
          _id: user[underscoreId],
        });
      }
      return done(null, false);
    });
  }));
};
