const joi = require('joi');

// Define the user schema for validation
const userSchema = joi.object({
  name: joi.string().alphanum().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
    role: joi.string().valid('user', 'admin').default('user'),
});
    
// Middleware to validate user data
const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ error: error.details.map(detail => detail.message) });
  }
  next();
};
module.exports = {
  validateUser,
};