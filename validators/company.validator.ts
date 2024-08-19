import Joi from "joi";


export const createCompanySchema = Joi.object().keys({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  address: Joi.string().required(),
  logo: Joi.string().uri().allow("").optional(),
});

export const createCompanyAdminSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  username: Joi.string().required(),
  companyId: Joi.number().required(),
});
