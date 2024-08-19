import express from "express";
import ManagerController from "../controllers/cms_ManagerController";
import schemaValidator from "../middleware/schemaValidator";

const router = express.Router();

router.post("/", schemaValidator("/create-manager"), ManagerController.createOne);
router.get("/company/:companyId", ManagerController.getAllWithoutPagination);
router.get('/', ManagerController.getAll);
router.get("/:id", ManagerController.getOne);
router.patch(
  "/:id",
  schemaValidator("/update-manager"),
  ManagerController.updateOne
);
router.delete("/:id", ManagerController.softDelete);

// Route to get managers by roleId
router.get("/role/:roleId", ManagerController.getAll);

export default router;
