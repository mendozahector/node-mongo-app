const e = require('express');
const db = require('../models');
const User = db.user;
const myFunctions = require('../library/functions');


const getAll = (req, res) => {
    User.find({})
      .then((data) => {
        res.status(200);
        res.send(data);
      })
      .catch((err) => {
        console.log(err.message);
        res.status(500).send({
          message: 'Could not get users from database. Please try again later.'
        });
      });
  };

const getSingle = (req, res) => {
  const username = req.params.username;
  User.findOne({ username: username })
    .then((data) => {
      if (data === null || data.length == 0) {
        res.status(400).send({ message: 'Could not find username ' + username + ' in the database.' });
      } else {
        res.status(200).send(data);
      }
    })
    .catch((err) => {
      console.log(err.message)
      res.status(500).send({
        message: 'Error getting user from database. Please try again later.'});
    });
};

const insertUser = async (req, res) => {
  try {
    // Validate request
  if (!req.body.username || !req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password || !req.body.birthdate) {
    res.status(400).send({ message: 'Fields can not be empty!' });
    return;
  }

  if (!myFunctions.isValidDate(req.body.birthdate)) {
    res.status(400).send({ message: "Invalid birthdate. Format should be: yyyy-mm-dd." });
    return;
  }

  let newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    birthdate: new Date(req.body.birthdate),
    middleName: req.body.middleName
  });

  // Validate password
  passwordValidation = newUser.isValidPassword(req.body.password);
  if (passwordValidation.length > 0) {
    res.status(400).send({ message: 'Invalid password: ', details: passwordValidation });
    return;
  }

  newUser
  .save()
    .then((data) => {
      r = {id: data._id, username: data.username}
      res.status(201).send(r);
    })
    .catch((err) => {
      if (err._message === 'users validation failed') {
        res.status(400).send({ message: err.message });
      } else {
        console.log(err);
        res.status(500).send({ message: 'Could not insert the new user. Please try again later.' });
      }
    });
  } catch(err) {
    console.log(err);
    res.status(500).send({ message: 'Could not insert the new user. Please try again later.' });
  }
};

const updateContact = async (req, res) => {

  try {
    const username = req.params.username;
    const password = req.body.password;

  if (!username || !password) {
    res.status(400).send({ message: 'Username and password field cannot be empty' });
    return;
  }
  User.findOne({ username: username })
    .then((user) => {
      if (user === null || user.length == 0) {
        res.status(400).send({ message: 'Could not find username ' + username + ' in the database.' });
      } else {
        user.validatePassword(password)
        .then((valid) => {
          if (!valid) {
            res.status(400).send({ message: 'Password is not valid. Please try again.' });
          } else {
            
            let updatedUser = {}

            if (req.body.birthdate) {
              if (!myFunctions.isValidDate(req.body.birthday)) {
                res.status(400).send({ message: "Invalid birthday. Format should be: yyyy-mm-dd." });
                return;
              }
              updatedUser['birthdate'] = new Date(req.body.birthdate)
            }

            if (req.body.firstName) {
              updatedUser['firstName'] = req.body.firstName
            }
            if (req.body.middleName) {
              updatedUser['middleName'] = req.body.middleName
            }
            if (req.body.lastName) {
              updatedUser['lastName'] = req.body.lastName
            }
            if (req.body.username) {
              updatedUser['username'] = req.body.username
            }
            if (req.body.email) {
              updatedUser['email'] = req.body.email
            }
            Object.assign(user, updatedUser);
            user.save()
              .then((data) => {
                res.status(204).send();
              })
              .catch((err) => {
                if (err._message === 'users validation failed') {
                  res.status(400).send({ message: err.message });
                } else {
                  console.log(err);
                  res.status(500).send({ message: 'Could not update the user. Please try again later.' });
                }
              });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        message: 'Error getting user from database. Please try again later.'});
    });
  } catch (err) { 
    console.log(err);
    res.status(500).send({ message: 'Could not insert the new user. Please try again later.' });
  }
}

const deleteContact = (req, res) => {
  const username = req.params.username;
  User.deleteOne({ username: username })
    .then((data) => {
      if (data.acknowledged) {
        if (data.deletedCount > 0) {
          res.status(200).send();
        } 
        else {
          res.status(400).send({ message: 'Could not find username ' + username + ' in the database.' });
        }
      } else {
        res.status(400).send({ message: 'Could not delete the user. Not authorized.' });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: 'Error deleting username ' + username + ' from database. Please try again later.',
      });
    });
};

module.exports = { getAll, insertUser, getSingle, updateContact, deleteContact};