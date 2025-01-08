import * as admin from "firebase-admin";

export default class AuthService {
    static async verifyToken(idToken: string) {
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            console.log("Token válido.");
            return decodedToken;
        } catch (error : any) {
            console.error(`Erro na validação do token: ${error.message}`);
            throw new Error("Token inválido");
        }
    }
}
