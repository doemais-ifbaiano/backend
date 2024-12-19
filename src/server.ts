import express, { Request, Response } from 'express';
import passport from './config/passportConfig';
import session from 'express-session';
import userRoutes from './routes/userRoutes'; 
import authRoutes from './routes/authRoutes';

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false
    })
);

// Chama as funções middleware do passport
app.use(passport.initialize());
app.use(passport.session());


app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('Bem-vindo ao Doe Mais');
    } else {
        res.send('Você precisa estar logado');
    }
});

app.use('/', (req:Request, res:Response) => {
    res.send('Backend Doe Mais')
});


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
});