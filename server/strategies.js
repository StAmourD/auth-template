import passport from 'passport';
import { genPassword } from './util.js';
import { User } from './db.js';

export async function googleCallback(req, res, next) {
  passport.authenticate('google', (err, user) => {
    if (err) {
      console.error(err);
      return res.redirect('/'); // Redirect to homepage on error
    }

    if (!user) {
      return res.redirect('/'); // Redirect to homepage if authentication fails
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error(err);
        return res.redirect('/'); // Redirect to homepage on login error
      }

      res.redirect('/'); // Redirect to homepage on successful login
    });
  })(req, res, next);
}

export async function githubCallback(req, res, next) {
  passport.authenticate('github', { scope: ['user:email'], prompt: 'login' }, (err, user) => {
    if (err) {
      console.error(err);
      return res.redirect('/'); // Redirect to homepage on error
    }

    if (!user) {
      return res.redirect('/'); // Redirect to homepage if authentication fails
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error(err);
        return res.redirect('/'); // Redirect to homepage on login error
      }

      res.redirect('/'); // Redirect to homepage on successful login
    });
  })(req, res, next);
}

export async function loginLocalRegister(req, res, next) {
  // validate this is a unique user name
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        throw new Error('Username already exists.');
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
        displayname: req.body.displayname,
      });

      newUser.save().then((user) => {
        console.log(user);
        loginLocal(req, res, next);
      });

      // res.redirect("/login");
    })
    .catch((err) => {
      next(err);
    });
}

export async function loginLocal(req, res, next) {
  passport.authenticate('local', function (err, user) {
    if (!user) {
      res.status(401).send({ authenticated: false, message: 'Invalid username or password.' });
    } else {
      req.logIn(user, function () {
        res
          .status(err ? 401 : 200)
          .send(
            err
              ? { authenticated: false, message: 'Invalid username or password.' }
              : { authenticated: true, displayname: user.displayname }
          );
      });
    }
  })(req, res, next);
}

export async function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.json({ authenticated: false });
  }
}

export async function logout(req, res) {
  req.logout((err) => {
    if (err) {
      console.error(err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
      // fetch()
      res.json({ authenticated: false });
      // res.redirect('/'); // Redirect to homepage after logout
      // res.json({ authenticated: false })
    });
  });
}
