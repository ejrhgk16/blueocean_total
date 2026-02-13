import { ArgumentsHost, Catch, ExceptionFilter, Injectable, Logger } from "@nestjs/common";
import { BaseException } from "./error.baseException";
import { AccessTokenExpiredException, RefreshTokenExpiredException, RoleException, UnCatchedException } from "./error.customExceptions";
import { format } from "date-fns";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {

    constructor(){

    }

    private readonly logger = new Logger();

    catch(exception: any, host: ArgumentsHost): void {

  
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        
        const res = exception instanceof BaseException ? exception : new UnCatchedException();

        res.timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        res.path = request.url;

        const clientIP = request.headers['x-real-ip']

        // console.log(exception)

        //로그 여기다
        if (!(exception instanceof RefreshTokenExpiredException) && !(exception instanceof AccessTokenExpiredException)) {

            this.logger.error("[" + request.url+"]" +" ::: "+ res.errorName + " ::: " + clientIP + " ::: " + exception.message)
         

        }




        response.status(res.statusCode).json({
            errorCode: res.errorCode,
            errorName : res.errorName,
            statusCode: res.statusCode,
            timestamp: res.timestamp,
            path: res.path,
        });
    }
}