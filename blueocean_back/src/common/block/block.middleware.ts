import { Global, Injectable, NestMiddleware, Req } from "@nestjs/common";
import { BlockService } from "./block.service";
import { Request, Response, NextFunction} from "express";
import { BlockIpException } from "../error/error.customExceptions";

@Injectable()
export class IpBlockMiddleware implements NestMiddleware {


    constructor(private readonly ipBlockService: BlockService) {}

    async use(req: Request, res: Response, next: NextFunction) {
      // console.log(req.originalUrl )

      if(req.originalUrl == "/" || req.originalUrl == "/auth/logout"){
        return next();
      }

      let clientIp = req.headers['x-real-ip'] as string || '';
      // clientIp = '192.168.229.1'
  
      const isBlocked = await this.ipBlockService.checkIsBlockIp(clientIp);
      if (isBlocked) {
        throw new BlockIpException()
      }
  
      next();
    }

}