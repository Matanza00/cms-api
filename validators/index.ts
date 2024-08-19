import Joi, { ObjectSchema } from "joi";
import { loginSchema, setPasswordSchema } from "./auth.validator";
import {
  createCompanyAdminSchema,
  createCompanySchema,
} from "./company.validator";
import { createUserSchema, updateUserSchema } from "./user.validators";
import { createVehicleSchema, updateVehicleSchema } from "./vehicle.validator";
import { createDriverSchema, updateDriverSchema } from "./driver.validator";
import { createManagerSchema, updateManagerSchema } from "./manager.validator";
import { createFileSchema, updateFileSchema } from "./file.validator";
import {
  createProviderSchema,
  updateProviderSchema,
} from "./provider.validator";
import { createClinicSchema, updateClinicSchema } from "./clinic.validator";
import { uploadFileSchema } from "./file.validator";

export default {
  "/login": loginSchema,
  "/set-password": setPasswordSchema,
  "/create-company": createCompanySchema,
  "/create-company-admin": createCompanyAdminSchema,
  "/create-user": createUserSchema,
  "/update-user": updateUserSchema,
  "/create-vehicle": createVehicleSchema,
  "/update-vehicle": updateVehicleSchema,
  "/create-driver": createDriverSchema,
  "/update-driver": updateDriverSchema,
  "/create-manager": createManagerSchema,
  "/update-manager": updateManagerSchema,
  "/create-file": createFileSchema,
  "/update-file": updateFileSchema,
  "/create-provider": createProviderSchema,
  "/update-provider": updateProviderSchema,
  "/create-clinic": createClinicSchema,
  "/update-clinic": updateClinicSchema,
  "/upload-file": uploadFileSchema,
} as Record<string, ObjectSchema>;
