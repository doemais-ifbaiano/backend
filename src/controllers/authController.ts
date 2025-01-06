import { Request, Response } from "express";
import AuthService from "../services/authService";

export default class AuthController {

    static async authenticate(req: Request, res: Response): Promise<void> {
        const { idToken } = req.body;

        if (!idToken) {
            res.status(400).json({ error: "Token não fornecido." });
            return;
        }
        try {
            const token = await AuthService.verifyToken(idToken);
            res.status(200).json({ message: "Autenticado com sucesso", user: token});
        } catch (error : any) {
            res.status(400).json({ error: `Autenticação falhou ${error.message}` });
        }
    }
}