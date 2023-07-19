import { User } from './db.js';

export async function getProfile(req, res, next) {
  User.findById(req.user.id)
    .then((thisUser) => {
      req.profile = {
        displayname: thisUser.displayname,
        color: thisUser.color,
        petcount: thisUser.petcount,
      };
      next();
    })
    .catch((err) => {
      // TODO handle error
      console.log(err);
    });
}

export async function postProfile(req, res, next) {
  User.findByIdAndUpdate(req.user.id, {
    displayname: req.body.displayname,
    color: req.body.color,
    petcount: req.body.petcount,
  })
    .then((err) => {
      res.status(200);
      res.send({
        displayname: req.body.displayname,
        color: req.body.color,
        petcount: req.body.petcount,
      });
    })
    .catch((err) => {
      // TODO handle error
      console.log(err);
    });
}
