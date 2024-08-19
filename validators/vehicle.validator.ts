import Joi from "joi";

export const createVehicleSchema = Joi.object().keys({
  registrationNo: Joi.string().required(),
  make: Joi.string().required(),
  model: Joi.string().required(),
  type: Joi.string().required(),
  size: Joi.string().required(),
  fuelType: Joi.string().required(),
  currentOddometerReading: Joi.number().required(),
  commisionDate: Joi.string().required(),
  doorType: Joi.string().required(),
  region: Joi.string().optional(),
  subRegion: Joi.string().optional(),
  station: Joi.string().optional(),
  registrationCertificate: Joi.string().required(),
  companyId: Joi.number().required(),
});

export const updateVehicleSchema = Joi.object().keys({
  make: Joi.string(),
  model: Joi.string(),
  type: Joi.string(),
  size: Joi.string(),
  fuelType: Joi.string(),
  currentOddometerReading: Joi.string(),
  commisionDate: Joi.string(),
  doorType: Joi.string(),
  region: Joi.string(),
  subRegion: Joi.string(),
  station: Joi.string(),
  registrationCertificate: Joi.string(),
  companyId: Joi.number(),
});

export const softDeleteVehicleSchema = Joi.object().keys({
  registrationNo: Joi.string().required(),
  companyId: Joi.number().required(),
});
