import { Request, Response } from "express";
import AuthService from "../services/authService";

export default class AuthController {
    static async login(req: Request, res: Response) {
        const { username, password } = req.body;

        try {
            const token = await AuthService.login({ username, password });
            res.status(200).json({ token });
        } catch (error : any) {
            res.status(400).json({ error: error.message });
        }
    }
}