import express from "express";
import RoleController from "../controllers/roleController";
const router = express.Router();

router.post("/add", RoleController.createRole);
router.get("/all/company/:companyId", RoleController.getAllRolesAndPermissions);
router.get("/company/:companyId", RoleController.getAllRoles);
router.patch("/:roleId", RoleController.updateRolePermissions);
export default router;
