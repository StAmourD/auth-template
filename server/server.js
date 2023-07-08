import express from 'express'
import session from 'express-session'
import passport from './auth.js'
import { googleCallback, githubCallback, checkAuthenticated, logout, loginLocalRegister, loginLocal } from './strategies.js'
import bodyParser from 'body-parser'
import { User } from './db.js'
// Package documentation - https://www.npmjs.com/package/connect-mongo
import MongoStore from 'connect-mongo'

import dotenv from 'dotenv'
import { error } from 'console'

dotenv.config({ path: './.env' })

const app = express()
const port = 5000 // Replace with the desired port number

// Middleware setup
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
      done(null, user);
  });
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
  res.json({ authenticated: true, displayname: req.user.displayname });
});

app.post('/auth/login', loginLocal)

app.post("/auth/register", loginLocalRegister)

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});