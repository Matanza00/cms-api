import express from "express";
import CMS_UserController from "../controllers/cms_UserController";
import schemaValidator from "../middleware/schemaValidator";

const router = express.Router();

router.post("/", schemaValidator("/create-user"), CMS_UserController.createUser);
router.get("/company/:companyId", CMS_UserController.getAllUsers);
router.get('/', CMS_UserController.getAllUsersInfo);
router.get("/:id", CMS_UserController.getOneUser);
router.patch(
  "/:id",
  schemaValidator("/update-user"),
  CMS_UserController.updateUser
);

// router.delete("/:id/company/:companyId", UserController.deleteOneUser);
router.delete("/:id", CMS_UserController.softDeleteUser);

// Route to get users by roleId
router.get("/role/:roleId", CMS_UserController.getUsersByRole);

export default router;
