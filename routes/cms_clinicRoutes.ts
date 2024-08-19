import express from "express";
import ClinicController from "../controllers/cms_ClinicController";
import schemaValidator from "../middleware/schemaValidator";

const router = express.Router();

// Routes for clinic management
router.post("/", schemaValidator("/create-clinic"), ClinicController.createOne);
router.get("/", ClinicController.getAll); // Assuming you want to list all clinics
router.get("/:id", ClinicController.getOne);
router.patch(
  "/:id",
  schemaValidator("/update-clinic"),
  ClinicController.updateOne
);
router.delete("/:id", ClinicController.softDelete);

export default router;
