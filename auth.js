import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
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
      // User.findOrCreate({ githubId: profile.id }, function (err, user) {
      //   return done(err, user);
      // });
      return done(null, profile)
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
      return done(null, profile)
    }
  )
);

export default passport;
