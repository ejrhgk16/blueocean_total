import { Injectable } from '@nestjs/common';
import { StoreRepository } from './store.repository';
import { CodeUtilService } from 'src/common/util/codeUtil.service';
import { ConfigService } from '@nestjs/config';
import { FileUtilService } from 'src/common/util/fileUtil.service';

@Injectable()
export class StoreService {

    constructor(private readonly storeRepository : StoreRepository , private readonly codeUtilService : CodeUtilService, private readonly configService: ConfigService, private readonly fileUtilService : FileUtilService) {}

    async getStoreDBListService(param): Promise<any>{

        const [pageingDto, result] = await this.storeRepository.getStoreDBList(param)
        return {paging : pageingDto , list : result}

    }

    async getStoreDBDetailService(param): Promise<any>{

        const rows = await this.storeRepository.getDBDetail(param)
        return rows[0]

    }

    async updateStoreDBDetailService(param): Promise<any>{

        const rows = await this.storeRepository.updateDBDetail(param)
        return rows

    }

    async getDBRoundListService(param): Promise<any>{

        const rows = await this.storeRepository.getDbRoundList(param)
        return rows

    }

    async updateDBRoundServcie(param): Promise<any>{

        const rows = await this.storeRepository.updateDBRound(param)
        return rows

    }

    async getDBRoundInfoListService(param): Promise<any>{

        const rows = await this.storeRepository.getDBRoundInfoList(param)
        return rows

    }

    async getStatusCountListService(param): Promise<any>{

        const rows = await this.storeRepository.getStatusCountList(param)
        return rows

    }

    async getDBManageListService(param): Promise<any>{

        const [pageingDto, result] = await this.storeRepository.getDBManageList(param)
        return {paging : pageingDto , list : result}

       

    }

   async updateRegInfoRoundService(param): Promise<any>{

        const rows = await this.storeRepository.updateRegInfoRound(param)
        return rows

    }

    async updateStatusService(param): Promise<any>{

        const rows = await this.storeRepository.updateStatus(param)
        return rows

    }

    async addDBRegInfoDataService(param): Promise<any>{

        const rows = await this.storeRepository.addDBRegInfoData(param)
        return rows

    }


    async deliveryListService(param): Promise<any>{

        const rows = await this.storeRepository.deliveryList(param)
        return rows

    }

    async getPageListService(param): Promise<any>{

        const rows = await this.storeRepository.getPageList(param)
        return rows

    }

    async updateDeliveryService (param): Promise<any>{

        const rows = await this.storeRepository.updateDelivery(param)
        return rows

    }

    async getDashBoardChartData (param): Promise<any>{

        if(param.type == "month"){
            return await this.storeRepository.getDashBoardChartDataByMonth(param);            
        } 
        if(param.type == "week"){
            return await this.storeRepository.getDashBoardChartDataByWeek(param);
        }
        if(param.type == "day"){
            return await this.storeRepository.getDashBoardChartDataByDay(param);
        }
    }

    async getDashBoardInfoDataService(param): Promise<any>{

        const rows = await this.storeRepository.getStoreRegInfo(param)
        return rows[0]

    }

    async getPageStatsListService(param): Promise<any>{

        const [pageingDto, result] = await this.storeRepository.getPageStatsList(param)
        return {paging : pageingDto , list : result}

    }

    async getAdPageListService(param): Promise<any>{

        const [pageingDto, result] = await this.storeRepository.getAdPageList(param)
        return {paging : pageingDto , list : result}

    }

    async addAdService(body, files): Promise<any>{

        const page_code = this.codeUtilService.createCode_8();

        //s3 파일명  = store_code/page_code/파일명

        // req.files.forEach((file, index) => {
        //     // 각각의 파일 정보와 함께 관련된 데이터도 확인
        //     console.log(`Received file ${index}: ${file.originalname}`);
        //     console.log(`Description for file_${index}: ${req.body[`description_${index}`]}`);
        //     console.log(`Use for file_${index}: ${req.body[`use_${index}`]}`);
        // });

        

        let param:Record<string,any> = {}

        param.page_code = page_code
        param.url = this.configService.get<string>('FRONT_DOMAIN') + '/landing/'+ body.store_code + '/' + page_code
        param.files_len = files.length;
        param.insert_db_list = []; 
       
        Object.keys(body).map((key) => {

            if(key.indexOf('content_') > -1 ){
                param[key] = JSON.parse(body[key])
                param[key].content_img_path = this.configService.get<string>('S3_URL') + "/img/" + param.store_code + "/"+param.page_code+"/"+ param[key].content_name
            }
            else if(key.indexOf('insert_db_') > -1 ){

                const temp = JSON.parse(body[key])
                temp.content_img_path = this.configService.get<string>('S3_URL') + "/img/" + param.store_code + "/"+param.page_code+"/"+ temp.content_name
                param.insert_db_list.push(temp)
                
            }
            else{
                param[key] = body[key] == 'null' || body[key] == '' ? null : body[key]
            }

        });

        let result1 : Record<string, any> = {}

        try {
            const result = files.map((file, index)=>{
                const tpmeKey = "content_"+index+"_info";
                const fileName = param.store_code + "/"+param.page_code+"/"+ param[tpmeKey].content_name
                return this.fileUtilService.uploadFile(file, fileName)
            })
    
            const results = await Promise.all(result)

            result1.code1 = "success"
            result1.msg1 = "파일업로드성공"


            
        } catch (error) {
            console.log(error)
            result1.code1 = "fail"
            result1.msg1 = "파일업로드실패"

            
        }
        
        //files.length
        const result2 = await this.storeRepository.addAd(param)

        result1.msg2 = result2.msg;
        result1.code2 = result2.code
  


        return result1

    }

    async getPageDetailService(param): Promise<any>{

        const [result1, result2] = await this.storeRepository.getAdPageDetail(param)
        return {pageInfo : result1[0] , contentList : result2}

    }

    async updateAdService(body, files): Promise<any>{

        let param:Record<string,any> = {}

        param.url = this.configService.get<string>('FRONT_DOMAIN') + '/'+ body.store_code + '/' + body.page_code
        param.files_len = files.length; 
        param.update_db_list = []
        param.insert_db_list = []


        const renameImgList = []

        Object.keys(body).map((key) => {

            if(key.indexOf('content_') > -1 ){
                param[key] = JSON.parse(body[key])
                param[key].content_img_path = this.configService.get<string>('S3_URL') + "/img/" + param.store_code + "/"+param.page_code+"/"+ param[key].content_name
            }
            else if(key.indexOf('update_db_') > -1 ){//없앴음
                const temp = JSON.parse(body[key])
                temp.content_img_path = this.configService.get<string>('S3_URL') + "/img/" + param.store_code + "/"+param.page_code+"/"+ temp.content_name
                param.update_db_list.push(temp)
            }
            else if(key.indexOf('insert_db_') > -1 ){

                const temp = JSON.parse(body[key])
                if(temp.content_origin_name){
                    renameImgList.push(temp)
                }
                temp.content_img_path = this.configService.get<string>('S3_URL') + "/img/" + param.store_code + "/"+param.page_code+"/"+ temp.content_name
                param.insert_db_list.push(temp)
                
            }
            else{
                param[key] = body[key] == 'null' || body[key] == '' ? null : body[key]
            }

            
            
        
        });


        let result1 : Record<string, any> = {}
                //files.length
        const result2 : Record<string, any> = await this.storeRepository.updateAd(param)

        result1.msg2 = result2.msg;
        result1.code2 = result2.code
        result1.path = result2.path



        try {

            const result0 = renameImgList.map((item, index)=>{
                const oldKey = "img/" + param.store_code + "/"+param.page_code+"/"+ item.content_origin_name
                const newKey = "img/" + param.store_code + "/"+param.page_code+"/"+ item.content_name
                return this.fileUtilService.renameFile(oldKey, newKey)
            })                                                                                                                                                  

            const results0 = await Promise.all(result0)

            const result = files.map((file, index)=>{
                const tpmeKey = "content_"+index+"_info";
                const fileName = param.store_code + "/"+param.page_code+"/"+ param[tpmeKey].content_name
                return this.fileUtilService.uploadFile(file, fileName)
            })
    
            const results = await Promise.all(result)

            result1.code1 = "success"
            result1.msg1 = "파일업로드성공"


            
        } catch (error) {
            console.log(error)
            result1.code1 = "fail"
            result1.msg1 = "파일업로드실패"
            
            
        }
        

        return result1

    }

    async getPrivacyListService(param): Promise<any>{

        const rows = await this.storeRepository.getPrivacyList(param)
        return rows

    }

    
    async updatePrivacyService(param): Promise<any>{

        const rows = await this.storeRepository.updatePrivacy(param)
        return rows

    }

    async getEventListService(param): Promise<any>{

        const rows = await this.storeRepository.getEventList(param)
        return rows

    }

    async updateEventListService(param): Promise<any>{

        const rows = await this.storeRepository.updateEventList(param)
        return rows

    }

    async getScriptListService(param): Promise<any>{

        const rows = await this.storeRepository.getScriptList(param)
        return rows

    }

    async updateScriptListService(param): Promise<any>{

        const rows = await this.storeRepository.updateScriptList(param)
        return rows

    }

    async getBlockListService(param): Promise<any>{

        const rows = await this.storeRepository.getBlockList(param)
        return rows

    }

    async updateBlockListService(param): Promise<any>{

        const rows = await this.storeRepository.updateBlockList(param)
        return rows

    }

    async getApiListService(param): Promise<any>{

        const rows = await this.storeRepository.getApiList(param)
        return rows

    }

    async updateApiListService(param): Promise<any>{

        const rows = await this.storeRepository.updateApiList(param)
        return rows

    }

    
 

    
    




}
