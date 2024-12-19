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

    static async findUserById(id : any) {
        return await prisma.usuarios.findUnique({
            where: { id }
        });
    }

    static async generateRandomPassword() {
        const randomPassword = Math.random().toString(36).slice(-6);
        
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        return hashedPassword;
    }
    
    static async findOrCreateUser(profile : any) {
        let user = await prisma.usuarios.findFirst({
            where: { google_id: profile.id }
        })

        if (!user) {
            const password = await this.generateRandomPassword();
            user = await prisma.usuarios.create({
                data: {
                    nome_usuario: profile.displayName,
                    senha: password,
                    email: profile.emails[0].value,
                    google_id: profile.id, 
                },
            });
        }
        return user;
    }
}