import Joi from "joi";

export const createManagerSchema = Joi.object().keys({
  employeeId: Joi.string().required(),
  name: Joi.string().required(),
  joiningDate: Joi.date().required(),
  licenseType: Joi.string(),
  cnic: Joi.string(),
  currentPlaceOfPosting: Joi.string(),
  companyId: Joi.number().required(),
});

export const updateManagerSchema = Joi.object().keys({
  name: Joi.string(),
  joiningDate: Joi.date(),
  licenseType: Joi.string(),
  cnic: Joi.string(),
  currentPlaceOfPosting: Joi.string(),
  companyId: Joi.number(),
});

export const softDeleteManagerSchema = Joi.object().keys({
  employeeId: Joi.string().required(),
  companyId: Joi.number().required(),
});
