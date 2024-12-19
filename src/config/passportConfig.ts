import passport from "passport";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserService from "../services/userService";

passport.use(
    new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            callbackURL: 'http://localhost:3000/auth/google/callback',
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await UserService.findOrCreateUser(profile);
                return done(null, user);
            } catch (error) {
                return done(error, false)
            }
        }
    )
)

// Serializa o ID do usuário para salvar na sessão
passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

// Desserializa o usuário com base no ID salvo na sessão retornando os dados para os req que eu precisar
passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserService.findUserById(id);

        if (!user) {
            return done(null, false);
        }
        
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
});

export default passport;