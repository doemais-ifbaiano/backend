import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface LoginInput {
    username: string;
    password: string;
}

export default class AuthService {
    
    static async login({ username, password }: LoginInput) {
        try {
            const user = await prisma.usuarios.findUnique({
                where: { nome_usuario: username }
            });
            
            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            const validPassword = await bcrypt.compare(password, user.senha);

            if (!validPassword) {
                throw new Error('Senha incorreta!');
            }
            const token = jwt.sign(
                {id: user.id, email: user.email},
                process.env.JWT_SECRET || 'camarada-luigi-mangione', //Depois definir uma chave no env
                { expiresIn: '30m'}
            );
            return token;
        } catch (error : any) {
            throw new Error(error.message || 'Erro no login');
        }
    }
}