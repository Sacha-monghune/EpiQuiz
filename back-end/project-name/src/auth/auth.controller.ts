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

            let user = await this.userService.findOneBySub(userInfo.sub);
            console.log(`isUser: ${user}`);
            if (!user) {
                user = await this.userService.create({
                    sub: userInfo.sub,
                    username: userInfo.given_name,
                    email: userInfo.email});
                console.log('user created')
            }
            const payload = { sub: user.sub, username: user.username };
            const accessToken = await this.jwtService.signAsync(payload)

            res.json({ accessToken: accessToken });
        } catch (err) {
            console.error(`Erorr ${err}`);
            res.status(500).send('Authentication failed');
        }
    }
}

// {
//   sub: '111750532237155910589',
//   name: 'Sacha Mong hune',
//   given_name: 'Sacha',
//   family_name: 'Mong hune',
//   picture: 'https://lh3.googleusercontent.com/a/ACg8ocI4aDcVXi7fXCcMQkzhoIgM7AAyd8pEjfR_rUTIB1VEjwF4mg=s96-c',
//   email: 'smonghune@gmail.com',
//   email_verified: true
// }
