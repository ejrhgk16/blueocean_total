import { HttpException } from "@nestjs/common";
import { IBaseException } from "./error.vo";

export class BaseException extends HttpException implements IBaseException {
    constructor(errorCode: string, errorName:string, statusCode: number) {
        super(errorCode, statusCode);
        this.errorCode = errorCode;
        this.errorName = errorName
        this.statusCode = statusCode;
        
    }

    errorCode: string;
    errorName : string;
    statusCode: number;
    timestamp: string;
    path: string;

}