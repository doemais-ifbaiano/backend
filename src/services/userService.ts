import { db } from "../firebase-admin"; 
import * as admin from 'firebase-admin';
import { User } from "../models/User";
import GiverService from "./giverService";
import { Giver } from "@/models/Giver";


export default class UserService {
    static async createUser(user: User, giver: Giver, idToken?: string): Promise<string | undefined> {
        try {
            let authUser;

            await this.checkIfExists("username", user.username, "O nome de usuário já está em uso");
            await this.checkIfExists("email", user.email, "O e-mail já está em uso");

            // Se idToken é fornecido estamos criando o usuário com Google
            if (idToken) {

                // Verificar o idToken do Google mandado pelo frontend
                const decodedToken = await admin.auth().verifyIdToken(idToken);
                const uid = decodedToken.uid;

                authUser = await admin.auth().getUser(uid);
                if (!authUser) {
                    throw new Error('Usuário não encontrado no Firebase Auth');
                }
            } else {
                authUser = await admin.auth().createUser({
                    email: user.email,
                    password: user.password,
                    displayName: user.username,  
                });
            }

            const userRef = db.collection("users").doc(authUser.uid);
            await userRef.set({
                username: user.username,
                email: user.email,
                createdAt: new Date(),
            });

            /*Criando Giver associado ao usuário, usei o id, mas pelo firebase ser de documentos, existem 
            outras possibildiades*/
            giver.userId = authUser.uid; 
            const giverId = await GiverService.createGiver(giver);

            if (giverId) {
                return authUser.uid;
            } else {
                console.error("Erro ao criar o Giver.");
                return undefined;
            }
        } catch (error) {
            console.error("Erro ao criar ou autenticar o usuário:", error);
            return undefined;
        }
    }

    private static async checkIfExists(field: string, value: string, errorMessage: string): Promise<void> {
        const exists = await db.collection("users").where(field, "==", value).get();
        if (!exists.empty) {
            throw new Error(errorMessage);
        }
    }
}
