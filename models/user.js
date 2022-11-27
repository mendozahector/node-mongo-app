module.exports = (mongoose) => {
  const bcrypt = require('bcryptjs');
  const { isEmail } = require('validator');
  var uniqueValidator = require('mongoose-unique-validator');
  const SALT_WORK_FACTOR = 10;
  const passwordValidator = require('password-validator');

  const passwordSchema = new passwordValidator();
  // Add properties to it
  passwordSchema
  .is().min(8)                                    // Minimum length 8
  .is().max(45)                                   // Maximum length 45
  .has().uppercase()                              // Must have uppercase letters
  .has().lowercase()                              // Must have lowercase letters
  .has().digits()                                 // Must have at least 1 digit
  .has().not().spaces()

  const userSchema = mongoose.Schema({
    username: {
      type: String, required: true, unique: true
    },
    firstName: {
      type: String, required: true
    },
    middleName: {
      type: String, required: false
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
    },
    birthdate: {
      type: Date, required: true
    },
  });

  userSchema.plugin(uniqueValidator);

  userSchema.pre('save', async function save(next) {
    if (!this.isModified('password')) {
      this.increment(); return next();
    } 
    try {
      const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
      this.password = await bcrypt.hash(this.password, salt);
      return next();
    } catch (err) {
      return next(err);
    }
  });

  userSchema.methods.isValidPassword = function isValidPassword(password) {
    return passwordSchema.validate(password, { details: true });
  }
  
  userSchema.methods.validatePassword = async function validatePassword(data) {
    return bcrypt.compare(data, this.password);
  };

  return mongoose.model('users', userSchema);
};