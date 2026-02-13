import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import { RefreshTokenExpiredException, RefreshTokenInvalidTokenException } from 'src/common/error/error.customExceptions';

@Injectable()
export class refreshAuthGuard extends AuthGuard('refresh') {

  handleRequest(err: any, user: any, info: any, context: any, status: any) {


    if (err || !user) {//인증실패시 user-false 성공시 user객체

        if (info instanceof TokenExpiredError) {
            console.log("TokenExpiredError ::: ")
            throw new RefreshTokenExpiredException();
        }else{
            throw new RefreshTokenInvalidTokenException();
        }
    }

    return super.handleRequest(err, user, info, context, status);
  }
}