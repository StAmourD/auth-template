import express from 'express'
import session from 'express-session'
import passport from './auth.js'
import { googleCallback, githubCallback, checkAuthenticated, logout, loginLocal } from './strategies.js'
import bodyParser from 'body-parser'
import { genPassword } from './util.js'
import { User } from './db.js'
// Package documentation - https://www.npmjs.com/package/connect-mongo
import MongoStore from 'connect-mongo'

import dotenv from 'dotenv'
import { error } from 'console'

dotenv.config({ path: './.env' })

const app = express()
const port = 5000 // Replace with the desired port number

// Middleware setup
passport.serializeUser(function(user, done) {
    // persist user information to DB
    let providerPrefix = ''
    let username
    if (user.provider === 'github') {
      providerPrefix = 'GH'
      username = providerPrefix + user.id
    }
    if (user.provider === 'google') {
      providerPrefix = 'GO'
      username = providerPrefix + user.id
    }
    if (user.provider === undefined) {
      providerPrefix = ''
      username = user.username
    }
    // add user to DB elsewhere, not found here is invalid password
    User.findOne({ username: username })
        .then((thisUser) => {
          if (!thisUser) {
            // TODO does null/null create a security hole
            const newUserValues = {
              hash: null,
              salt: null,
              username: providerPrefix + user.id,
              user: user,
              displayName: user.displayName
            }

            const newUser = new User(newUserValues);
            
            newUser.save()
            
            return {
              username: newUserValues.username,
              user: newUserValues.user,
              displayName: newUserValues.displayName
            }
          } else {
            return {
              username: thisUser.username,
              user: thisUser.user,
              displayName: thisUser.displayName
            }
          }

        })
        .then((user) => {
          done(null, user);
        })
        .catch((err) => {
          // should this rethrow or no catch at all?
          done(err, false);
        })
});

passport.deserializeUser(function(user, done) {
  // Get user information from DB
  User.findOne({ username: user.username })
    .then((thisUser) => {
      if (thisUser) {
        return {
          username: thisUser.username,
          user: thisUser.user,
          displayName: thisUser.displayName
        }
      }
    })
  .then((user) => {
    // throw an error if user is not found from session
    done(null, user);
  })
  .catch((err) => {
    throw new Error(err)
  })
});

const sessionStore = MongoStore.create({
  // mongooseConnection: connection,
  mongoUrl: process.env.DB_STRING,
  collection: "sessions"
});

app.use(bodyParser.urlencoded({limit: '5000mb', extended: true, parameterLimit: 100000000000}));
app.use(express.json());
app.use(session(
  {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 45,
    }
  }
));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
app.get('/auth/google/callback', googleCallback);
app.get('/auth/logout', logout);
app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ], session: true }));
app.get('/auth/github/callback', githubCallback);
app.get('/auth/check', checkAuthenticated, (req, res) => {
  res.json({ authenticated: true, profile: req.user.user, displayName: req.user.displayName });
});

app.post('/auth/login', loginLocal)

app.post("/auth/register", (req, res, next) => {
  // validate this is a unique user name
  User.findOne({ username: req.body.username })
      .then((user) => {
        if (user) {
          throw new Error("Username already exists.");
        }
      })
      .then(() => {
        const saltHash = genPassword(req.body.password);
      
        const salt = saltHash.salt;
        const hash = saltHash.hash;
      
        const newUser = new User({
          hash: hash,
          salt: salt,
          username: 'LO' + req.body.username,
          user: null,
          displayName: req.body.displayName
        });
      
        newUser.save().then((user) => {
          console.log(user);
        });
      
        res.redirect("/login");
      })
      .catch((err) => {
        next(err);
      })

})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});