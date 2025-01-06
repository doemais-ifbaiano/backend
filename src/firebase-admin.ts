import * as admin from 'firebase-admin';

// Inicializa o Firebase Admin SDK com as credenciais de serviço
admin.initializeApp({
  credential: admin.credential.cert(require("../doe-mais.json")),
});

export const auth = admin.auth();  
export const db = admin.firestore();  