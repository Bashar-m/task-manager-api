const joi = require('joi');

exports.register = joi.object({
  name: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  role: joi.string().valid('user', 'admin').optional(),
})

exports.login = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
})

exports.getUsrById = joi.object({
  _id: joi.objectId().required(),
})