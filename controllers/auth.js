const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const db = require('../models');
const User = db.user;

const login = (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if (!username || !password) {
        res.status(400).send({ message: 'Username and password field cannot be empty.' });
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
            req.session.isAuth = true;
            res.status(201).send();
          }
        });
      }
    })
    .catch((err) => {
      console.log(err.message)
      res.status(500).send({
        message: 'Login error. Please try again later.'});
    });
};
  
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).send({message: 'Logout error. Please try again later.'});
        } else {
            res.status(200).send();
        }
    });
};


const authorize = (req, res) => {
    res.redirect(
        `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`,
      );
};

const checkGitHub = (req, res) => {

    const code = req.query.code;

    if (code === null || code === undefined) {
        const message = req.query.error_description ? req.query.error_description : 'Invalid GitHub auth code';
        res.status(400).send({ message:  message});
        return;
    }

    const body = {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
    };
    const opts = { headers: { accept: 'application/json' } };

    axios
    .post('https://github.com/login/oauth/access_token', body)
    .then((_res) => {
        token =_res.data;
        const key = token.split('=', 1)[0];
        const value = (token.split('=', 2)[1]).split('&', 1)[0];

        if (key === 'access_token') {
            req.session.isAuth = true;
            res.status(200).send({ message: 'User authorized with GitHub token'});
        } else if (key === 'error') {
            res.status(400).send({ message: value });
        } else {
            res.status(500).send({ message: 'Could not get GitHub token. Please try again.' });
        }
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

module.exports = {
    authorize, checkGitHub, login, logout
};