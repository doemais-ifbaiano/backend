import { Router } from "express";
import AuthController from "../controllers/authController";


const router = Router();

router.post('/login', AuthController.login);

router.get('/google', AuthController.googleAuthenticate);

router.get('/google/callback', AuthController.googleCallback);

export default router;