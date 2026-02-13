import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import { AccessTokenExpiredException, AccessTokenInvalidTokenException } from 'src/common/error/error.customExceptions';

@Injectable()
export class AccessAuthGuard extends AuthGuard('access') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {

    if (err || !user) {//인증실패시 user-false 성공시 user객체

        if (info instanceof TokenExpiredError) {
            throw new AccessTokenExpiredException();
        }else{
            throw new AccessTokenInvalidTokenException();
        }
    }

    return super.handleRequest(err, user, info, context, status);
  }
}