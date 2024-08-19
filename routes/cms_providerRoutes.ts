import express from "express";
import ProviderController from "../controllers/cms_ProviderController";
import schemaValidator from "../middleware/schemaValidator";

const router = express.Router();

// Routes for provider management
router.post(
  "/",
  schemaValidator("/create-provider"),
  ProviderController.createOne
);
router.get("/", ProviderController.getAll); // Assuming you want to list all providers
router.get("/:id", ProviderController.getOne);
router.patch(
  "/:id",
  schemaValidator("/update-provider"),
  ProviderController.updateOne
);
router.delete("/:id", ProviderController.softDelete);

export default router;
