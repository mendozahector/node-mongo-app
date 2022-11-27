const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');

const login = (req, res) => {
    console.log("Lets login");
};
  
const logout = (req, res) => {
    console.log("Lets logout");
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
            res.status(200).send({ token: value });
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