import express from 'express'
import session from 'express-session'
import passport from './auth.js'
import { get, googleCallback, logout, githubCallback, checkAuthenticated, loginLocal } from './strategies.js'
import mongoose from 'mongoose'
// Package documentation - https://www.npmjs.com/package/connect-mongo
import MongoStore from 'connect-mongo'
import crypto from 'crypto'
import bodyParser from 'body-parser'
import { Strategy as LocalStrategy  } from 'passport-local';

import dotenv from 'dotenv'
import { error } from 'console'

dotenv.config({ path: './.env' })

const app = express()
const port = 5000 // Replace with the desired port number

// Database Setup
// const connection = mongoose.createConnection(process.env.DB_STRING);
mongoose.connect(process.env.DB_STRING).then(() => console.log('Connected to MongoDB')).catch(e => console.error(e));

const UserSchema = new mongoose.Schema({
  username: String,
  hash: String,
  salt: String,
  user: Object,
  displayName: String
});

const User = mongoose.model("User", UserSchema)

// Middleware setup
passport.serializeUser(function(user, done) {
    // persist user information to DB
    // TODO verify auth provider is GH here
    User.findOne({ username: 'GH' + user.id })
        .then((thisUser) => {
          if (!thisUser) {
            // TODO does null/null create a security hole
            const newUserValues = {
              hash: null,
              salt: null,
              username: 'GH' + user.id,
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
app.get('/auth/google', get);
app.get('/auth/google/callback', googleCallback);
app.get('/auth/logout', logout);
app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ], session: true }));
app.get('/auth/github/callback', githubCallback);
app.get('/auth/check', checkAuthenticated, (req, res) => {
  res.json({ authenticated: true, profile: req.user.user, displayName: req.user.displayName });
});

// Since we are using the passport.authenticate() method, we should be redirected no matter what
app.post('/auth/login', loginLocal, (err, req, res, next) => {
    console.log(req)
    if (err) {
      next(err)
    }
  }
);

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
          username: req.body.username,
          user: req.body,
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

// TODO Move these

passport.use(
  new LocalStrategy(function (username, password, cb) {
    User.findOne({ username: username })
      .then((user) => {
        if (!user) {
          return cb(null, false);
        }

        // Function defined at bottom of app.js
        const isValid = validPassword(password, user.hash, user.salt);

        if (isValid) {
          return cb(null, user);
        } else {
          return cb(null, false);
        }
      })
      .catch((err) => {
        cb(err);
      });
  })
);

function validPassword(password, hash, salt) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}

function genPassword(password) {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash,
  };
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});