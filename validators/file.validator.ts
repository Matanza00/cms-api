import Joi from "joi";

export const createFileSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  path: Joi.string().required(),
  // Add more fields as needed
});

export const updateFileSchema = Joi.object({
  name: Joi.string(),
  type: Joi.string(),
  path: Joi.string(),
  // Add more fields as needed
});

export const uploadFileSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().valid("pdf", "docx", "jpg", "png").required(),
  // Add other relevant fields
});
