import { Inject, Injectable} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class MessageUtilService {

  constructor(private httpService: HttpService, private configService: ConfigService) {}

  async sendMsg(receiverList){
    const DIRECTSEND_USERNAME = this.configService.get<string>('DIRECTSEND_USERNAME')
    const DIRECTSEND_KEY = this.configService.get<string>('DIRECTSEND_KEY')
    const DIRECTSEND_NUMBER = this.configService.get<string>('DIRECTSEND_NUMBER')

    const receiver = []
    
    for(let i =0; i<receiverList.length; i++){
      receiver.push({mobile : receiverList[i]})
    }
    
    const data = {
        title : '블루오션',
        message : '고객님의 소중한 DB가 유입되었습니다. -블루오션-',
        sender : DIRECTSEND_NUMBER,
        username : DIRECTSEND_USERNAME,
        key : DIRECTSEND_KEY,
        receiver: JSON.stringify(receiver),
        sms_type : 'NORMAL'
    };

    const headers = {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json;charset=utf-8',
      'Accept': 'application/json'
    };

    // console.log(data)

    try {
        const response = await firstValueFrom(
          this.httpService.post('https://directsend.co.kr/index.php/api_v2/sms_change_word', data,  { headers })
        );

        // console.log(response);
        
        if (response?.data.status === '0') {
        return { success: true, msg: '메시지가 성공적으로 발송되었습니다.' };
        } else {
        return { success: false, message: `발송 실패: ${response.data.msg}` };
        }
    } catch (error) {
        return { success: false, message: `오류 발생: ${error.msg}` };
    }
    }
  

      
}
