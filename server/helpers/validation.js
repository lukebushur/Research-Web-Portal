/* This file uses the joi module to validate the data send to this express server, and
 ensures it conforms to the user.js schema in the models folder*/
const Joi = require('joi');

//Validation for the register request, ensures password is long enough and email is an email
const registerSchema = Joi.object({
    "email": Joi.string().min(6).max(25).email().required(),
    "password": Joi.string().min(10).max(255).required(),
});

//Validation for the login schema
const loginSchema = Joi.object({
    "email": Joi.string().min(6).max(25).email().required(),
    "password": Joi.string().min(10).max(255).required(),
});

module.exports = {
    registerSchema,
    loginSchema,
}