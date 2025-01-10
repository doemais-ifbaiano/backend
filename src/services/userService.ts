import { db } from "../firebase-admin"; 
import * as admin from 'firebase-admin';
import { User } from "../models/User";
import GiverService from "./giverService"; 
import { Giver } from "@/models/Giver";

export default class UserService {
    static async createUser(
        user?: User, 
        giver?: Giver, 
        idToken?: string 
    ): Promise<string | undefined> {
        try {
            let authUser;

            if (idToken) {
                const decodedToken = await admin.auth().verifyIdToken(idToken);
                const uid = decodedToken.uid;

                authUser = await admin.auth().getUser(uid);
                if (!authUser) {
                    throw new Error("Usuário não encontrado no Firebase Auth");
                }

                await this.checkIfExists("email", authUser.email || "", "O e-mail já está em uso");

                // Salva User no Firestore usando as informações do Google)
                const userRef = db.collection("users").doc(authUser.uid);
                await userRef.set({
                    email: authUser.email,
                    createdAt: new Date(),
                });

                const giverData: Giver = {
                    name: authUser.displayName || "",
                    cpfCnpj: "",  
                    phoneNumber: "",  
                    birthDate: new Date(0),  
                    userId: authUser.uid,
                };

                const giverId = await GiverService.createGiver(giverData);

                if (!giverId) {
                    throw new Error("Erro ao criar o Giver.");
                }

                return authUser.uid;

            } else {
                if (!user || !giver) {
                    throw new Error("Os dados do usuário e do doador são obrigatórios para cadastro manual.");
                }

                await this.checkIfExists("email", user.email, "O e-mail já está em uso");

                authUser = await admin.auth().createUser({
                    email: user.email,
                    password: user.password,
                });

                const userRef = db.collection("users").doc(authUser.uid);
                await userRef.set({
                    email: user.email,
                    createdAt: new Date(),
                });

                // Salvar o Giver no Firestore
                const giverData: Giver = {
                    name: giver.name,
                    cpfCnpj: giver.cpfCnpj,
                    phoneNumber: giver.phoneNumber,
                    birthDate: giver.birthDate,
                    userId: authUser.uid,
                };
                const giverId = await GiverService.createGiver(giverData);

                if (!giverId) {
                    throw new Error("Erro ao criar o Giver.");
                }

                return authUser.uid;
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
