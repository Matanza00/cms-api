import Joi from "joi";

export const loginSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const setPasswordSchema = Joi.object().keys({
  password: Joi.string()
    .min(8) // Minimum length of 8 characters
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one special character',
    }),
});
