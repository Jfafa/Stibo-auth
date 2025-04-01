import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User, { IUser } from '../models/User';


passport.use(
  new LocalStrategy(
    async (username, password, done) => {
      try {
        
        const user = await User.findOne({
          $or: [{ username }, { email: username }]
        });
        
        if (!user) {
          return done(null, false, { message: 'Incorrect username or email' });
        }
        
        
        const isValid = await user.isValidPassword(password);
        if (!isValid) {
          return done(null, false, { message: 'Incorrect password' });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, (user as IUser)._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport; 