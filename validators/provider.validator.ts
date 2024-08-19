import Joi from "joi";

export const createProviderSchema = Joi.object({
  name: Joi.string().required(),
  contact: Joi.string().required(),
  // Add more fields as needed
});

export const updateProviderSchema = Joi.object({
  name: Joi.string(),
  contact: Joi.string(),
  // Add more fields as needed
});
