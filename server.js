import express from 'express'
import session from 'express-session'
import passport from './auth.js'
import { get, googleCallback, logout, githubCallback, checkAuthenticated } from './src/routes/auth.js'
import mongoose from 'mongoose'
// Package documentation - https://www.npmjs.com/package/connect-mongo
import MongoStore from 'connect-mongo'

import dotenv from 'dotenv'

dotenv.config({ path: './.env' })

const app = express()
const port = 5000 // Replace with the desired port number
// const myUserStore = {}

// Database Setup
// const connection = mongoose.createConnection(process.env.DB_STRING);

const UserSchema = new mongoose.Schema({
  username: String,
  hash: String,
  salt: String,
});

mongoose.model("User", UserSchema);

// Middleware setup
passport.serializeUser(function(user, done) {
  // store user information in sessions DB? and look up here
  // if (!myUserStore.hasOwnProperty(user.id)) {
  //   myUserStore[user.id] = user
  // }
  done(null, {
    userid: user.id,
    user: user,
    test1: 'test V3, a very long piece of text here.  lakjd;fklja;sdlfj kjasdfkjasd;fkljadjdjasfkljasdfkljasd;fjdkjasfjasdfkjasdfjadkjsfdjasfkljadsfjdjasfkljadsfjadjkjasdf;ajsdfkljads;fkjadfjdjasf;kjadsfkjasdfjasdfkjadfjjasdfkjasf;lajsdf;ljadsfklad;sfj;ladkjsfdkasfkjasd;fkja;dkjsfdkjasfksdfkljadsfdas'
  });
});

passport.deserializeUser(function(user, done) {
  // get user information from DB here?
  done(null, user.userid);
});

const sessionStore = MongoStore.create({
  // mongooseConnection: connection,
  mongoUrl: process.env.DB_STRING,
  collection: "sessions"
});

app.use(express.json());
app.use(session(
  {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});