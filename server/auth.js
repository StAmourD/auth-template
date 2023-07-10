import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as GitHubStrategy } from 'passport-github2'
import { Strategy as LocalStrategy  } from 'passport-local'
import { validPassword } from './util.js'
import { User } from './db.js'
import dotenv from 'dotenv'

dotenv.config({ path: './.env' })

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      // Handle the user's Google authentication data as needed
      User.findOne({googleId: profile.id}).then((currentUser) => {
        if(currentUser){
            // already have this user
            console.log('user is: ', currentUser);
            done(null, currentUser);
        } else {
            // if not, create user in our db
            new User({
                googleId: profile.id,
                displayname: profile.displayName
            }).save().then((newUser) => {
                console.log('created new user: ', newUser);
                done(null, newUser);
            });
        }
    });
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      // Handle the user's GitHub authentication data as needed
      // return done(null, profile)
      User.findOne({githubId: profile.id}).then((currentUser) => {
        if(currentUser){
            // already have this user
            console.log('user is: ', currentUser);
            done(null, currentUser);
        } else {
            // if not, create user in our db
            new User({
                githubId: profile.id,
                displayname: profile.displayName
            }).save().then((newUser) => {
                console.log('created new user: ', newUser);
                done(null, newUser);
            });
        }
    });
    }
  )
);

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({username: username})
      .then((currentUser) => {
        if(currentUser){
            // already have this user
            console.log('user is: ', currentUser)
            const isValid = validPassword(password, currentUser.hash, currentUser.salt)
            if (isValid) {
              done(null, currentUser)
            } else {
              console.log('invalid password: ', username)
              done(new Error("Invalid username or password."), false)
            }
        } else {
            // invalid username
            console.log('user not found: ', username)
            done(new Error("Invalid username or password."), false)
        }
      })
      .catch((err) => {
        done(err, false)
      })
  })
);

export default passport;
