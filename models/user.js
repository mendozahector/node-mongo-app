module.exports = (mongoose) => {
  const bcrypt = require('bcryptjs');
  const { isEmail } = require('validator');
  var uniqueValidator = require('mongoose-unique-validator')
  const SALT_WORK_FACTOR = 10;

  const userSchema = mongoose.Schema({
    username: {
      type: String, required: true, unique: true
    },
    firstName: {
      type: String, required: true
    },
    lastName: {
      type: String, required: true
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail, 'invalid email'],
      unique: true,
    },
    password: {
      type: String, required: true
    }
  });

  userSchema.plugin(uniqueValidator);

  userSchema.pre('save', async function save(next) {
    if (!this.isModified('password')) return next();
    try {
      const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
      this.password = await bcrypt.hash(this.password, salt);
      return next();
    } catch (err) {
      return next(err);
    }
  });
  
  userSchema.methods.validatePassword = async function validatePassword(data) {
    return bcrypt.compare(data, this.password);
  };

  return mongoose.model('users', userSchema);
};