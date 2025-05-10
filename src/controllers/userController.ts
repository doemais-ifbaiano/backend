import { Request, Response } from "express";
import UserService from "../services/userService";

export default class UserController {

    static async register(req: Request, res: Response): Promise<void> {
        const { username, password, email} = req.body;

        try {
            const usernameInUse = await UserService.findUserByUsername(username);
            if (usernameInUse) {
                res.status(400).json({ message: "O nome de usuário já está em uso." });
                return;
            }

            const emailInUse = await UserService.findUserByEmail(email);
            if (emailInUse) {
                res.status(400).json({ message: "E-mail já cadastrado." });
                return;
            }

            const newUser = await UserService.save(username, password, email);
            res.status(201).json({
                message: 'Usuário cadastrado com sucesso.',
                user: {
                    id: newUser.id,
                    username: newUser.nome_usuario,
                    email: newUser.email
                }
            });
        } catch (error : any) {
            console.log(error);
            res.status(500).json({
                message: `Erro ao registrar usuário ${error.message}`,
            })
        }
    }
}