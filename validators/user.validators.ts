import Joi from "joi";

export const createUserSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  employeeId: Joi.string().required(),
  phone: Joi.string().required(),
  username: Joi.string().required(),
  roleId: Joi.number().required(),
  companyId: Joi.number().required(),
  station: Joi.string().optional(),
});

export const updateUserSchema = Joi.object().keys({
  employeeId: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  username: Joi.string().required(),
  roleId: Joi.number().required(),
  station: Joi.string().optional(),
});

export const softDeleteUserSchema = Joi.object().keys({
  id: Joi.number().required(),
  companyId: Joi.number().required(),
});
