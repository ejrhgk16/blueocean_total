import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { AuthRepository } from "./auth.repository";
import * as jwt from 'jsonwebtoken';
import { Request } from "express";
import { RefreshTokenExpiredException, RefreshTokenInvalidTokenException } from "src/common/error/error.customExceptions";


@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh') {

    constructor(private authRepository: AuthRepository, private configService: ConfigService) {
        super({
          jwtFromRequest: ExtractJwt.fromExtractors([
            (req: Request) => {
              // 쿠키에서 토큰 추출

              
              if(!req.cookies)throw new RefreshTokenInvalidTokenException();
              const token = req.cookies['refresh_token'];
              if(!token)throw new RefreshTokenInvalidTokenException();
              return token;
            },
          ]),
          secretOrKey: configService.get<string>('BOA_REFRESH_SECRET')
        })
    }

    async validate(payload: Payload, done: (err: any, user: any, info: any) => void) {
        //validate 함수는 JWT 토큰이 유효하고 서명이 검증된 후에 호출됩니다. 이 함수는 JWT 페이로드를 기반으로 사용자 정보를 추가로 검증하거나 데이터를 조회하는 역할을 합니다.


         return payload;

    }
}

export interface Payload{

    user_login_id : string,

}
