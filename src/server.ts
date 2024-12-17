import express, { Request, Response } from 'express';

const PORT = 3000;

const app = express();

app.use('/', (req:Request, res:Response) => {
    res.send('Backend Doe Mais')
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
});