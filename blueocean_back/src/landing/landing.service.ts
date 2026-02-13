import { Injectable } from '@nestjs/common';
import { LandingRepository } from './landing.repository';
import { ConfigService } from '@nestjs/config';
import { MessageUtilService } from 'src/common/util/messageUtil.service';

@Injectable()
export class LandingService {

    
    constructor(private readonly landingRepository : LandingRepository , private readonly messageUtilService : MessageUtilService, private readonly configService: ConfigService) {}


    async getContentListService(param): Promise<any>{

        const [result1, result2, result3] = await this.landingRepository.getContentList(param)
        return {contentList : result1, pageInfo : result2, scriptList : result3}

    }

    async getCompScriptService(param): Promise<any>{

        const result1 = await this.landingRepository.getCompScriptList(param)
        return result1
    }


    async getPrivcayServcie(param): Promise<any>{

        const rows = await this.landingRepository.getPrivacy(param)
        return rows[0]

    }

    
    async addRegInfoServcie(param, req): Promise<any>{

        param.reg_ip = req.headers['x-real-ip']

        const result = await this.landingRepository.addRegInfo(param)
        
        const result2 = await this.landingRepository.getStoreRecieverList(param)

        if(result2[0].send_phone_number){
            const send_phone_number_list = result2[0].send_phone_number.split(",")
            const msgResult = await this.messageUtilService.sendMsg(send_phone_number_list)
            console.log(msgResult)
        }

        return result

    }

    async updateCountService(param): Promise<any>{

        const result = await this.landingRepository.updateCount(param)
        return result

    }
}
