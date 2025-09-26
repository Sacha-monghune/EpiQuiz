import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as qs from 'querystring';

interface ProviderConfig {
    authorizeUrl: string,
    tokenUrl: string,
    clientId: string | undefined,
    clientSecret: string | undefined,
    redirectUri: string | undefined,
    scope: string,
    userInfoUrl: string
}

@Injectable()
export class AuthService {
    private providers: Record<string, ProviderConfig>

    constructor(private configService: ConfigService) {
        this.providers = {
            google: {
                authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
                tokenUrl: 'https://oauth2.googleapis.com/token',
                clientId : '164240749432-hbcjv3telr6fnbf1empa5jq9rrhujs6g.apps.googleusercontent.com',
                clientSecret : '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',
                redirectUri : 'http://localhost:4000/auth/google/callback',
                scope: 'profile email',
                userInfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
            },
        };
    }

    getAuthorizationUrl(provider: string) {
        const cfg = this.providers[provider];
        if (!cfg) {
            throw new NotFoundException('Unknown provider');
        }
        return cfg.authorizeUrl + '?' + qs.stringify({
            client_id: cfg.clientId,
            redirect_uri: cfg.redirectUri,
            response_type: 'code',
            scope: cfg.scope,
        });
    }

    async getToken(provider: string, code: string) {
        const cfg = this.providers[provider];
        if (!cfg) {
            throw new Error('Unknown provider');
        }

        const data = qs.stringify({
            code,
            client_id: cfg.clientId,
            client_secret: cfg.clientSecret,
            redirect_uri: cfg.redirectUri,
            grant_type: 'authorization_code',
        });

        const headers = { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' };
        const tokenResponse = await axios.post(cfg.tokenUrl, data, { headers });
        return tokenResponse.data.access_token;
    }

    async getUserInfo(provider: string, accessToken: string) {
        const cfg = this.providers[provider];
        if (!cfg) {
            throw new NotFoundException('Unknown provider');
        }

        const userInfo = await axios.get(cfg.userInfoUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
        return userInfo.data;
    }

    
}
