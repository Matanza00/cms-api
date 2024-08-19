import { Request } from "express";
import Joi from "joi";

export const createDriverSchema = Joi.object().keys({
  employeeId: Joi.string().required(),
  name: Joi.string().required(),
  joiningDate: Joi.date().required(),
  licenseType: Joi.string().required(),
  // score: Joi.string(),
  // region: Joi.string(),
  // subRegion: Joi.string(),
  station: Joi.string().required(),
  cnic: Joi.string().required(),
  license: Joi.string().required(),
  medicalCertificate: Joi.string().required(),
  companyId: Joi.number().required(),
});

export const updateDriverSchema = Joi.object().keys({
  name: Joi.string(),
  joiningDate: Joi.date(),
  licenseType: Joi.string(),
  // score: Joi.string(),
  // region: Joi.string(),
  // subRegion: Joi.string(),
  station: Joi.string(),
  cnic: Joi.string(),
  license: Joi.string(),
  medicalCertificate: Joi.string(),
  companyId: Joi.number(),
});

export const softDeleteDriverSchema = Joi.object().keys({
  employeeId: Joi.string().required(),
  companyId: Joi.number().required(),
});
