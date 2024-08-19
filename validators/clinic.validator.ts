import Joi from "joi";

export const createClinicSchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
  // Add more fields as needed
});

export const updateClinicSchema = Joi.object({
  name: Joi.string(),
  location: Joi.string(),
  // Add more fields as needed
});
