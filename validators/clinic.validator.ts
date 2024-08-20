import Joi from "joi";

export const createClinicSchema = Joi.object({
  cms_UsersId: Joi.number().integer().required(),
  name: Joi.string().required(),
  companyId: Joi.number().integer().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zipCode: Joi.string().required(),
  country: Joi.string().required(),
  phone: Joi.string().required(),
  cell: Joi.string().optional(),
  faxNo: Joi.string().optional(),
  email: Joi.string().email().optional(),
  url: Joi.string().optional(),
  assignedEmployee: Joi.number().integer().optional(),
  license: Joi.string().optional(),

  // contactName: Joi.string().optional(),
  // contactPhone: Joi.string().optional(),
  // contactCell: Joi.string().optional(),
  // contactAddress: Joi.string().optional(),
  // contactEmail: Joi.string().optional(),
  // contactPager: Joi.string().optional(),
});

export const updateClinicSchema = Joi.object({
  cms_UsersId: Joi.string().required(),
  companyId: Joi.string().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zipCode: Joi.string().required(),
  country: Joi.string().required(),
  phone: Joi.string().required(),
  cell: Joi.string().optional(),
  faxNo: Joi.string().optional(),
  email: Joi.string().email().optional(),
  url: Joi.string().uri().optional(),
  assignedEmployee: Joi.number().integer().optional(), // Ensure assignedEmployee is an integer
  license: Joi.string().optional(), // Make license optional
  // contactName: Joi.string().optional(),
  // contactPhone: Joi.string().optional(),
  // contactCell: Joi.string().optional(),
  // contactAddress: Joi.string().optional(),
  // contactEmail: Joi.string().optional(),
  // contactPager: Joi.string().optional(),
});
