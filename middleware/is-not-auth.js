module.exports = (req, res, next) => {
    if (req.session.isAuth) {
        res.status(401).send({ message: 'User is already authenticated.' });
        return;
    } else {
        next();
    }
  };