import { Injectable, Logger, Param } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenInvalidTokenException } from 'src/common/error/error.customExceptions';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {

    constructor(private readonly authRepository : AuthRepository,  private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

    private readonly logger = new Logger();

    async login(body, req): Promise<any>{
        const [rows, rows2] = await this.authRepository.findUserByIdPassword(body);
        if(rows?.length > 0){

             const access_token = this.jwtService.sign(
                {user_login_id : rows[0].user_login_id, role_name: rows[0].role_name, role_type : rows[0].role_type}, 
                {secret: this.configService.get<string>('BOA_JWT_SECRET'), 
                expiresIn: '30m'
            } )

             const refresh_token = this.jwtService.sign({user_login_id : rows[0].user_login_id}, 
                {secret: this.configService.get<string>('BOA_REFRESH_SECRET'), 
                expiresIn: '1500m'
            })

             const clientIP = req.headers['x-real-ip']

             this.logger.log('customInfo', rows[0].user_login_id + "로그인 성공 ::: " + clientIP)

             const param = {...body, refresh_token : refresh_token}

             const result2 = await this.authRepository.deleteTokenAndinsertToeknIntransaction(param);

             let result : Record<string, any> = {};

             result.access_token = access_token
             result.refresh_token = refresh_token
             result.user_login_id = rows[0].user_login_id
             result.user_name = rows[0].user_name
             result.role_name = rows[0].role_name
             result.role_type = rows[0].role_type
             result.loginSuccesYN = 'Y'
             result.store_list   = []

             rows2.forEach((item)=>{
                result.store_list.push(item)
             })

             const date = new Date()
             date.setMinutes(date.getMinutes() + 25);
             result.expire_time = date
             
             return result

        }else{
            var result : Record<string, any> = {};
            result.loginSuccesYN = 'N'
            return result;
        }
    }

    async logout(token): Promise<any>{

        const params : Record<string, any> = {};
        params.auth_refresh_token = token

        const result2 = await this.authRepository.deleteToken(params);

        return {msg : "logout !"}

    }

    async refreshToken(params : any): Promise<any>{//token 재발급
        try{

            const rows = await this.authRepository.getUserInfoAndRefreshToken(params);
            if(rows.length < 1){
                console.log("재발급에러")
                this.logger.error("refreshToken 재발급 에러")
                throw new RefreshTokenInvalidTokenException();
            }

            // console.log("refreshToken 새롭게 생성전")

            const access_token = this.jwtService.sign({user_login_id : rows[0].user_login_id, role_name: rows[0].role_name, role_type : rows[0].role_type}, 
                {secret: this.configService.get<string>('BOA_JWT_SECRET'), 
                expiresIn: '30m'} )

            const refresh_token = this.jwtService.sign({user_login_id : rows[0].user_login_id}, 
                {secret: this.configService.get<string>('BOA_REFRESH_SECRET'), 
                expiresIn: '1500m'})

            const refreshVertify = this.jwtService.verify(refresh_token, { secret: this.configService.get<string>('BOA_REFRESH_SECRET')})

             console.log("refreshToken 새롭게 생성후")

            params.refresh_token = refresh_token
            await this.authRepository.deleteTokenAndinsertToeknIntransaction(params)

            // console.log("refreshToken 디비 저장후")

            var result : Record<string, any> = {};
            result.access_token = access_token
            result.refresh_token = refresh_token

            const date = new Date()
            date.setMinutes(date.getMinutes() + 25);
            result.expire_time = date

            return result

        }catch(error){
            console.log(error)
            throw new RefreshTokenInvalidTokenException();
            // this.logger.error("refreshToken 재발급 에러")
        }
        

    }

    async getMenuListService(param): Promise<any>{
        const rows = await this.authRepository.getMenuList(param)
        return rows
    }


}
