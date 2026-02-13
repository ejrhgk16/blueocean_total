import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AccessAuthGuard } from './passport_access_guard.jwt';
import { refreshAuthGuard } from './passport_refresh_guard.jwt';
import { ConfigService } from '@nestjs/config';
import { RolesGuard } from './role.gaurd';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

  @Post("/login")
  //@UseGuards(AuthGuard("jwt"))
  async login(@Body() body, @Res({passthrough : true}) res : Response, @Req() req : Request){//passthrough 특정 조건에 따라 쿠키나 헤더를 설정). 나머지는 프레임워크에 맡깁니다.


      const result = await this.authService.login(body, req);

      // res.cookie('refresh_token', result.refresh_token, 
      //   {
      //   domain : 'http://localhost:3300', 
      //   httpOnly : true,
      //   secure: process.env.NODE_ENV === 'production',
      //   maxAge: 24 * 60 * 60 * 1000, //1d,
      //   sameSite: 'none',
      //   path : "/"
      // })

      return result;
  }

  @Get("/logout")
  //@UseGuards(AccessAuthGuard)
  async logout(@Req() req : Request, @Res({passthrough : true}) res : Response){//passthrough 특정 조건에 따라 쿠키나 헤더를 설정). 나머지는 프레임워크에 맡깁니다.

    const token = req.cookies['refresh_token'];

    const result = await this.authService.logout(token)

    return result;
  }

  @Get("/token/refresh")
  @UseGuards(refreshAuthGuard)
  async refreshToken(@Query() query, @Req() req : Request,  @Res({passthrough : true}) res : Response,){//passthrough 특정 조건에 따라 쿠키나 헤더를 설정). 나머지는 프레임워크에 맡깁니다.

    const token = req.cookies['refresh_token'];
    //const decoded = this.jwtService.verify(token, { secret: this.configService.get<string>('REFRESH_TOKEN_SECRET') });
    // console.log("Refreshtoekn:::", token)
    const user :Record<string, any> = req.user
    const params = {user_login_id : user.user_login_id, refresh_token : token}

  
     const result = await this.authService.refreshToken(params);

     return result;
  
  }

  
  // @Get("/toekn/test")
  // @UseGuards(AccessAuthGuard)
  // async toeknTest(@Query() query, @Res({passthrough : true}) res : Response, @Req() req){//passthrough 특정 조건에 따라 쿠키나 헤더를 설정). 나머지는 프레임워크에 맡깁니다.

  //   return {msg : "toeknTest"}
  // }

  @Get("/menu")
  @UseGuards(AccessAuthGuard)
  async menu(@Query() query, @Res({passthrough : true}) res : Response, @Req() req){

    //const param = {role_name : 'master'}
    const result = await this.authService.getMenuListService(req.user)

    return result
  
  }


}
