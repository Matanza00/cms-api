import express from "express";
import FileController from "../controllers/cms_FileController";
import schemaValidator from "../middleware/schemaValidator";

const router = express.Router();

// Routes for file management
router.post("/", schemaValidator("/upload-file"), FileController.createOne);
router.get("/", FileController.getAll);
router.get("/:id", FileController.getOne);
router.patch("/:id", schemaValidator("/update-file"), FileController.updateOne);
router.delete("/:id", FileController.deleteOne); // Note: Using deleteOne instead of softDelete for hard delete
router.patch("/soft-delete/:id", FileController.softDelete); // For soft deletion

export default router;
