import { Controller, Post, Body, Res, UnauthorizedException, Get, Param, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private jwtService: JwtService,
    ) {}

    @Post('signup')
    async signup(@Body() body: { email: string, username: string, password: string }, @Res() res: Response) {
        const exists = await this.userService.findByEmail(body.email);
        if (exists) {
            return res.status(400).json({ message: "Email déjà utilisé" });
        }
        const user = await this.userService.create({
            email: body.email,
            username: body.username,
            password: body.password,
        });
        return res.status(201).json({ id: user.id, email: user.email, username: user.username });
    }

    @Post('login')
    async login(@Body() body: { email: string, password: string }, @Res() res: Response) {
        const user = await this.userService.findByEmail(body.email);
        if (!user || user.password !== body.password) { // remplacer par un vrai hash
            throw new UnauthorizedException("Identifiants invalides");
        }
        const payload = { id: user.id, username: user.username };
        const accessToken = await this.jwtService.signAsync(payload);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24,
        });
        return res.json({ message: "Connecté", id: user.id, username: user.username });
    }

    @Get(':provider/login')
    redirectToProvider(@Param('provider') provider: string, @Res() res: Response) {
        const url = this.authService.getAuthorizationUrl(provider);
        res.redirect(url);
    }

    @Get(':provider/callback')
    async handleCallback(@Param('provider') provider: string, @Query('code') code: string, @Res() res: Response) {
        try {
            const token = await this.authService.getToken(provider, code);
            const userInfo = await this.authService.getUserInfo(provider, token);
            console.log(userInfo);

            let user = await this.userService.findOneById(userInfo.id);
            console.log(`isUser: ${user}`);
            if (!user) {
                user = await this.userService.create({
                    username: userInfo.given_name,
                    email: userInfo.email});
                console.log('user created')
            }
            const payload = { id: user.id, username: user.username };
            const accessToken = await this.jwtService.signAsync(payload)

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 1000 * 60 * 60 * 24,
            });

            return res.redirect(`http://localhost:3000/quiz`);
        } catch (err) {
            console.error(`Erorr ${err.message}`);
            res.status(500).send('Authentication failed');
        }
    }
}
