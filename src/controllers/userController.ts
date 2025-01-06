import { Request, Response } from "express";
import UserService from "../services/userService";
import { User } from "../models/User"; 
import { Giver } from "../models/Giver";

export default class UserController {

    static async registerUser(req: Request, res: Response): Promise<void> {
        try {
            const { username, email, password, name, cpfCnpj, phoneNumber, birthDate, idToken } = req.body;

            if (!username || !email || !password || !name || !cpfCnpj || !phoneNumber || !birthDate) {
                res.status(400).json({ error: "Todos os campos são obrigatórios" });
                return;
            }

            const user: User = { username, email, password };
            const giver: Giver = {
                name,
                cpfCnpj,
                phoneNumber,
                birthDate: new Date(birthDate), 
                userId: "" 
            };

            const userId = await UserService.createUser(user, giver, idToken);

            if (userId) {
                res.status(201).json({ message: "Usuário e Giver criados com sucesso", userId });
            } else {
                res.status(500).json({ error: "Erro ao criar o usuário e o giver" });
            }

        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
