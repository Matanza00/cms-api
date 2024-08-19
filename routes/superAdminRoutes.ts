import express from "express";
import SuperAdminController from "../controllers/superAdminController";
import schemaValidator from "../middleware/schemaValidator";

const router = express.Router();

router.post(
  "/company",
  schemaValidator("/create-company"),
  SuperAdminController.CreateCompany
);
router.post("/add-role-to-company", SuperAdminController.AddRoleToCompany);

router.get("/company", SuperAdminController.getAllCompanies);
router.get("/company/:id", SuperAdminController.getOneCompany);
router.post(
  "/create-company-admin",
  schemaValidator("/create-company-admin"),
  SuperAdminController.CreateCompanyAdmin
);
router.post(
  "/add-permissions-on-role",
  SuperAdminController.addRolePermissionstoRoleId
);
router.get("/get-comapny-admin/:id", SuperAdminController.getCompanyAdmin);
// router.get("/backup", SuperAdminController.createDbBackup);
// router.get("/get/backup/table", SuperAdminController.getDbbackup);

export default router;
