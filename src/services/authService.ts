import * as admin from "firebase-admin";


export default class AuthService {
    
    /*No caso o firebase com auth já consegue gerar o token JWT pelo frontend facilmente, assim, não se faz 
    necessário a criação do gerador de token e nem de middleware para validação do token*/
    static async verifyToken(idToken: string) {
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            console.log("Token válido")
            return decodedToken;
        } catch (error) {
            throw new Error("Token inválido");
        }
    }
}
