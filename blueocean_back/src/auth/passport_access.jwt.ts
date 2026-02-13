import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { AuthRepository } from "./auth.repository";
import * as jwt from 'jsonwebtoken';
import { AccessTokenExpiredException, AccessTokenInvalidTokenException } from "src/common/error/error.customExceptions";


@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access') {

    constructor(private authRepository: AuthRepository, private configService: ConfigService) 
    {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('BOA_JWT_SECRET')

        })
    }

    async validate(payload: any, done: (err: any, user: any, info: any) => void) {


        //validate 함수는 JWT 토큰이 유효하고 서명이 검증된 후에 호출됩니다. 이 함수는 JWT 페이로드를 기반으로 사용자 정보를 추가로 검증하거나 데이터를 조회하는 역할을 합니다.
         const rows = await this.authRepository.getUserStoreList(payload.user_login_id); // storeList가 길어질수있어서 이런식으로 db매번조회하는식으로하는게 jwt토큰에 삽입하는것보다 나을거 같음
         var user : Record<string, any> = {};
         if(payload instanceof Object){
          user = payload;
          user.store_code_arr = rows
         }

         const rows2 = await this.authRepository.getMenuList(payload);
         user.menuList = rows2
         //role_name으로 role_menu 리스트를 가져오고 user.menu_list에 넣자 getMenuList이걸로 가져오면될듯 role gaurd에서 코드값을 대체하고 비교해야하면될듯
         
        //  console.log("user ::: ", user);

         return done(null, user, '');

    }

    // 커스텀 verify 콜백
    // async verify(req, token, done) { 
    //   console.log("verify ::: ");
    //     try {
    //       const payload = jwt.verify(token, this.configService.get<string>('BOA_JWT_SECRET'));
    //       console.log("verify ::: ");
    //       console.log(payload);
    //       this.validate(payload, done).then();
    //     } catch (error) {
    //       console.log(error.name);
    //       if (error.name === 'TokenExpiredError') {
    //         done(new AccessTokenExpiredException(), false);
    //       } else if (error.name === 'JsonWebTokenError') {
    //         done(new AccessTokenInvalidTokenException(), false);
    //       } else {
    //         done(new AccessTokenInvalidTokenException(), false);
    //       }
    //     }
    //   };
}

export interface Payload{

    user_login_id : string,
    role_name : string,
    role_type : string,
    store_code_arr : any[]

}

