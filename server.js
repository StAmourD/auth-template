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
});

const User = mongoose.model("User", UserSchema)

// Middleware setup
passport.serializeUser(function(user, done) {
  // TODO persist user information to DB
  done(null, {
    userid: user.id,
    user: user,
    test1: 'test V3, a very long piece of text here.  lakjd;fklja;sdlfj kjasdfkjasd;fkljadjdjasfkljasdfkljasd;fjdkjasfjasdfkjasdfjadkjsfdjasfkljadsfjdjasfkljadsfjadjkjasdf;ajsdfkljads;fkjadfjdjasf;kjadsfkjasdfjasdfkjadfjjasdfkjasf;lajsdf;ljadsfklad;sfj;ladkjsfdkasfkjasd;fkja;dkjsfdkjasfksdfkljadsfdas'
  });
});

passport.deserializeUser(function(user, done) {
  // TODO get user information from DB
  done(null, user.userid);
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
  res.json({ authenticated: true, profile: req.session.passport.user.user, test1: req.session.passport.user.test1 });
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
  const saltHash = genPassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
    username: req.body.username,
    hash: hash,
    salt: salt,
  });

  newUser.save().then((user) => {
    console.log(user);
  });

  res.redirect("/login");
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