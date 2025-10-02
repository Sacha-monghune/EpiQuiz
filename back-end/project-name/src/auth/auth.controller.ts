import { Controller, Get, Param, Query, Redirect, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private jwtService: JwtService,
    ) {}

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
                    sub: userInfo.sub,
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
