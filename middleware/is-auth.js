module.exports = (req, res, next) => {
    if (req.session.isAuth) {
      next();
    } else {
        res.status(401).send({ message: 'User is not logged in.' });
        return;
    }
  };