import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default class UserService {

    static async save(username : string, password : string, email : string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return await prisma.usuarios.create({
            data: {
                nome_usuario: username,
                senha: hashedPassword,
                email
            }
        });
    }

    static async findUserByUsername( username : string) {
        return await prisma.usuarios.findUnique({
            where: { nome_usuario: username }
        });
    }

    static async findUserByEmail( email : string) {
        return await prisma.usuarios.findUnique({
            where: { email }
        });
    }
}