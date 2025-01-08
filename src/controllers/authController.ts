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
            const user = await AuthService.verifyToken(idToken);
            res.status(200).json({ message: "Autenticado com sucesso", user });
        } catch (error : any) {
            if (error.message === "Token inválido") {
                res.status(401).json({ error: "Credenciais inválidas." });
            } else {
                console.error(`Erro interno: ${error.message}`);
                res.status(500).json({ error: "Erro interno do servidor." });
            }
        }
    }
}
