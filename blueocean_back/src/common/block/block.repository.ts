import { Injectable } from '@nestjs/common';
import { DbService } from 'src/common/db/db.service';

@Injectable()
export class BlockRepository {

    constructor(
        private readonly dbService : DbService
     ){}
 
     async getBlockIpList(): Promise<any[]>{ 
 
         const query = "select id, block_ip, memo, status from boa_block_ip where status = 'Y' "
         const params = [];
 
         return this.dbService.executeQuery(query, params);
 
     }

     async updateBlockIpList(paramArr){

        const transactionResult = await this.dbService.executeTransaction(async (connection) => {
            const query = 'delete from boa_block_ip'
            const params = []
            const result1 = await this.dbService.executeQueryForShareConnection(connection, query, params);
    
            const query2 = 'insert into boa_block_ip(id, block_ip, status, memo) values';
    
            var valueQuery ='' 
            var  params2 = []
    
            for(var i=0; i<paramArr.length; i++){
    
              const temp = paramArr[i];
              const tempArr = [i+1, temp.name, temp.status, temp.memo];
              params2 = params2.concat(tempArr);
              valueQuery += '(?, ?, ?, ?)'
              if(i!=paramArr.length-1)valueQuery += ','
    
              tempArr.length = 0
    
            }

            const result2 = await this.dbService.executeQueryForShareConnection(connection, query2+valueQuery, params2);
    
        })
    
        return transactionResult;
      }





     
}
