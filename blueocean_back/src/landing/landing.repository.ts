import { Injectable } from "@nestjs/common";
import { DbService } from "src/common/db/db.service";
import { PagingDto } from "src/common/paging/paging.dto";
import sanitizeHtml from 'sanitize-html';


@Injectable()
export class LandingRepository {

    constructor(
        private readonly dbService : DbService
     ){}

     sanitizeInput(input: string): string {//xss 공격방지
      return sanitizeHtml(input, {
        allowedTags: [],
        allowedAttributes: {}
      });
    }

     async getContentList(param): Promise<any[]>{

        const resultMultiQuery = this.dbService.executeMultiQuery(async(connection)=>{

            const query2 = 'select bp.*, ba.api_url as external_api from (select * from boa_page where page_code = ?)bp left join (select * from boa_api where store_code = ?)ba on bp.api_num = ba.num'
  
            const params2 = [param.page_code, param.store_code]
            let result2 = await this.dbService.executeQueryForShareConnection(connection, query2, params2);

            let result3 = []
        
            const scriptNumArrString = result2[0].script_num
            const scriptNumArr = JSON.parse(scriptNumArrString);

            if(scriptNumArr && scriptNumArr.length > 0){
              const query3 = "select * from boa_script where store_code = ? and ( "
              const params4 = [param.store_code]
  
              let whereQury ='' 
        
              for(let i=0; i<scriptNumArr.length; i++){

                params4.push(scriptNumArr[i])
                whereQury += 'num = ? '

                if(i == scriptNumArr.length -1){
                  whereQury += ')'
                }else{
                  whereQury += 'or '
                }

              }
              result3 = await this.dbService.executeQueryForShareConnection(connection, query3+whereQury, params4);
              // console.log("result3", result3)
      
            }

            const query = "select * from boa_content where page_code = ? order by id"
            let params = [param.page_code]

            if(result2[0]?.replace_page_code){
              params = [result2[0].replace_page_code]
            }
            let result1 = await this.dbService.executeQueryForShareConnection(connection, query, params);

          

            return [result1, result2[0], result3]

        })

        return resultMultiQuery


      }

      async getCompScriptList(param): Promise<any[]>{
        // console.log("param",param)
        const resultMultiQuery = this.dbService.executeMultiQuery(async(connection)=>{

          const query2 = "select * from boa_page where page_code = ?"
          const params2 = [param.page_code]
          let result2 = await this.dbService.executeQueryForShareConnection(connection, query2, params2);

          let result3 = []
          const scriptNumArrString = result2[0].script_num_comp
          const scriptNumArr = JSON.parse(scriptNumArrString);

          if(scriptNumArr && scriptNumArr.length > 0){
            const query3 = "select * from boa_script where store_code = ? and ( "
            const params4 = [param.store_code]

            let whereQury ='' 
      
            for(let i=0; i<scriptNumArr.length; i++){

              params4.push(scriptNumArr[i])
              whereQury += 'num = ? '

              if(i == scriptNumArr.length -1){
                whereQury += ')'
              }else{
                whereQury += 'or '
              }

            }
            result3 = await this.dbService.executeQueryForShareConnection(connection, query3+whereQury, params4);
            // console.log("result3", result3)
    
          }

          // console.log(result3)



          return result3

      })

      return resultMultiQuery
      }

      async getPrivacy(param): Promise<any[]>{

        const resultMultiQuery = this.dbService.executeMultiQuery(async(connection)=>{

            const query = "select * from boa_privacy where store_code = ? and num = ? "
            const params = [param.store_code, param.privacy_num]
            const result1 = await this.dbService.executeQueryForShareConnection(connection, query, params);
            
            return result1

        })

        return resultMultiQuery


      }

      async addRegInfo(param){

     
        const transactionResult = await this.dbService.executeTransaction(async (connection) => {
            // console.log(typeof(param.reg_ip))
            // const query = 'SELECT * FROM boa_reg_info WHERE page_code = ? AND reg_ip = ? AND last_update BETWEEN DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 1 DAY)'
            // const params = [param.page_code, param.reg_ip]
            // const result1 = await this.dbService.executeQueryForShareConnection(connection, query, params);
            // if(result1.length > 0 && param.reg_ip && param.reg_ip != '::1'){
            //     return {code:"fail", msg:"이미 등록되어있습니다."}
            // }

            const query3 = 'SELECT * FROM boa_block_cust WHERE status="Y" and store_code = ? AND cust_name = ? and cust_phone_number = ?'
            const params3 = [param.store_code, param.cust_name, param.cust_phone_number]
           
            const result3 = await this.dbService.executeQueryForShareConnection(connection, query3, params3);

            if(result3.length > 0){
              return {code:"fail", msg:"해당 이벤트를 신청할수 없습니다."}
            }

    
            const query2 = 'insert into boa_reg_info(store_code, page_code, reg_ip, cust_name, cust_phone_number, cust_age, info_data) values(?, ?, ?, ?, ?, ?, ?)';
    
            let  params2 = [param.store_code, param.page_code, param.reg_ip, param.cust_name, param.cust_phone_number, param.cust_age, param.info_data]
            // console.log(params2)
            try {
              params2 = params2.map((paramstring:any)=>(
                this.sanitizeInput(paramstring)
              ))
            } catch (error) {
              console.log(error)
            }


          

            const result2 = await this.dbService.executeQueryForShareConnection(connection, query2, params2);
    
            return {code:"success", msg:"등록성공"}
    
        })
    
        return transactionResult;
      }

      async updateCount(param){

        const query = 'update boa_page set visit_count = visit_count + 1 where page_code = ?'
        const params = [param.page_code]
        const result1 = await this.dbService.executeQuery(query, params);
        return {code:"success", msg:"업데이트완료"}
    
      }

      async getStoreRecieverList(param){

        const query = 'select * from boa_store where store_code = ?'
        const params = [param.store_code]
        const result1 = await this.dbService.executeQuery(query, params);
        return result1
    
      }


    
}