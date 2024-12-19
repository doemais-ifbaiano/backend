import { Request, Response, NextFunction } from "express";
import AuthService from "../services/authService";
import passport from "passport";

export default class AuthController {

    static async login(req: Request, res: Response) {
        const { username, password } = req.body;

        try {
            const token = await AuthService.login({ username, password });
            res.status(200).json({ token });
        } catch (error : any) {
            res.status(400).json({ error: error.message });
        }
    }
    
    static googleAuthenticate(req: Request, res: Response) {
        passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
    }

    static googleCallback(req: Request, res: Response) {
        passport.authenticate('google', { failureRedirect: '/' })(req, res, () => {
            res.redirect('/dashboard');
        });
    }
}