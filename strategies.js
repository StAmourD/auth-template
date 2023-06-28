import passport from 'passport';

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

export async function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.json({ authenticated: false })
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
      res.json({ authenticated: false })
      // res.redirect('/'); // Redirect to homepage after logout
      // res.json({ authenticated: false })
    });
  });
}

export async function loginLocal(req, res, next) {
  passport.authenticate('local', {
      failureRedirect: "/login",
      successRedirect: "/login",
      session: true
    })(req, res, next);
}
