import { db } from "../firebase-admin"; 
import { Giver } from "../models/Giver"; 

export default class GiverService {
    static async createGiver(giver: Giver): Promise<string | undefined> {
        try {
            // Cria o documento do giver no Firestore com o userId do usuário
            const giverRef = await db.collection("givers").add({
                ...giver, // Todos os campos do giver, como name, cpfCnpj, etc.
            });

            // Retorna o ID do giver criado
            return giverRef.id;
        } catch (error) {
            console.error("Erro ao criar Giver:", error);
            return undefined;
        }
    }
}
