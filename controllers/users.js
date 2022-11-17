const db = require('../models');
const User = db.user;


const getAll = (req, res) => {
    User.find({})
      .then((data) => {
        res.status(200)
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'Could not get users from database.'
        });
      });
  };

const getSingle = (req, res) => {
  const username = req.params.username;
  User.find({ username: username })
    .then((data) => {
      res.status(200)
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error getting user from database.'
      });
    });
};

const insertUser = async (req, res) => {

  // Validate request
  if (!req.body.username || !req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
    res.status(400).send({ message: 'Fields can not be empty!' });
    return;
  }

  let newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  newUser
  .save()
    .then((data) => {
      r = {id: data._id, username: data.username}
      res.status(201).send(r);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Could not insert the new user. Please try again later.'
      });
    });
};

// const updateContact = async (req, res) => {
//   const userId = new ObjectId(req.params.id);
//   const firstName = req.body.firstName;
//   const lastName = req.body.lastName;
//   const email = req.body.email;
//   const favoriteColor = req.body.favoriteColor;
//   const birthday = req.body.birthday;

//   let updatedContact = {};

//   if (birthday && birthday.trim().length > 0) {
//     if (myFunctions.isValidDate(birthday)) {
//       updatedContact["birthday"] = birthday;
//     } else {
//       res.status(500).json("Invalid birthday. Format should be: yyyy-mm-dd.");
//       return;
//     }
//   }

//   if (firstName && firstName.trim().length > 0) {
//     updatedContact["firstName"] = firstName;
//   }

//   if (lastName && lastName.trim().length > 0) {
//     updatedContact["lastName"] = lastName;
//   }

//   if (email && email.trim().length > 0) {
//     updatedContact["email"] = email;
//   }

//   if (favoriteColor && favoriteColor.trim().length > 0) {
//     updatedContact["favoriteColor"] = favoriteColor;
//   }

//   const response = await mongodb
//     .getDb()
//     .db()
//     .collection('contacts')
//     .updateOne({ _id: userId }, { $set: updatedContact });
//   if (response.modifiedCount > 0) {
//     res.status(204).send();
//   } else {
//     res.status(500).json(response || 'Could not update the contact. Please try again.');
//   }
// }

const deleteContact = (req, res) => {
  const username = req.params.username;
  User.deleteOne({ username: username })
    .then((data) => {
      console.log(data.deletedCount);
      if (data.deletedCount > 0) {
        res.status(200).send();
      } else {
        res.status(500).json(response.error || 'Could not delete the user. Please try again.');
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error deleting user from database. Please try again later.',
      });
    });
};

module.exports = { getAll, insertUser, getSingle, deleteContact };