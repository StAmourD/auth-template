import express from 'express';
import session from 'express-session';
import passport from './auth.js';
import cookieParser from 'cookie-parser';
import { get, googleCallback, logout, githubCallback, checkAuthenticated } from './src/routes/auth.js';
import dotenv from 'dotenv'

dotenv.config({ path: './.env' })

const app = express()
const port = 5000 // Replace with the desired port number
const myUserStore = {}

// Middleware setup
passport.serializeUser(function(user, done) {
  if (!myUserStore.hasOwnProperty(user.id)) {
    myUserStore[user.id] = user
  }
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  done(null, id);
});

app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/auth/google', get);
app.get('/auth/google/callback', googleCallback);
app.get('/auth/logout', logout);
app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ], session: true }));
app.get('/auth/github/callback', githubCallback);
app.get('/auth/check', checkAuthenticated, (req, res) => {
  res.json({ authenticated: true, profile: myUserStore[req.user] });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});