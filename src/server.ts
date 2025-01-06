import express, { Request, Response } from 'express';
import userRoutes from './routes/userRoutes'; 
import authRoutes from './routes/authRoutes';

const PORT = 3000;

const app = express();
app.use(express.json());


app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.use('/', (req:Request, res:Response) => {
    res.send('Backend Doe Mais')
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
});