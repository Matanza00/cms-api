import express from "express";
import AuthController from "../controllers/authController";
import schemaValidator from "../middleware/schemaValidator";

const router = express.Router();

router.post("/login", schemaValidator("/login"), AuthController.login);
router.patch("/set-password/:token", schemaValidator("/set-password"), AuthController.setPassword);
router.post("/send-credentials/:id", AuthController.sendCredentials);

export default router;
