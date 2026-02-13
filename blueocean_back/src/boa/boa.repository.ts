import { Injectable } from '@nestjs/common';
import { start } from 'repl';
import { DbService } from 'src/common/db/db.service';
import { PagingDto } from 'src/common/paging/paging.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class BoaRepository {

    constructor(
        private readonly dbService : DbService
     ){}
 
     async getMenuList(param): Promise<any[]>{
 
         const query = "select boa_menu.menu_id,boa_menu.menu_name,boa_menu.menu_path, boa_menu.menu_depth, boa_menu.menu_type, boa_menu.parent_menu_id from boa_role_menu join (select * from boa_menu where menu_type = 'boa')boa_menu on boa_role_menu.menu_id  = boa_menu.menu_id where role_name=?"
         const params = [param.role_name];
 
         return this.dbService.executeQuery(query, params);
 
     }

     async getMenuListAll(param): Promise<any[]>{
 
      const query = "select * from boa_menu order by menu_type"
      const params=[]

      return this.dbService.executeQuery(query, params);

  }

     async getDashBoardList(param): Promise<any[]>{
 
        const query = "select store_code, store_name, register_time, status, IFNULL(today_count, 0)as today_count, IFNULL(yesterday_count, 0)as yesterday_count, IFNULL(month_count, 0)as month_count from boa_store left join"+ 
        "(SELECT store_code,"+
        "COUNT(CASE WHEN DATE(last_update) = CURDATE() THEN 1 "+ 
                "ELSE NULL END) AS today_count,"+
        "COUNT(CASE WHEN DATE(last_update) = CURDATE() - INTERVAL 1 DAY THEN 1 "+ 
                "ELSE NULL END) AS yesterday_count,"+
        "COUNT(CASE WHEN DATE_FORMAT(last_update, '%Y-%m') = DATE_FORMAT(current_date() , '%Y-%m') THEN 1 "+
                "ELSE NULL END) AS month_count "+
        "FROM "+ 
          "boa_reg_info "+
        "WHERE "+ 
          "last_update >= DATE_FORMAT(CURDATE() - INTERVAL 1 DAY, '%Y-%m-01') and status != '99' "+//이번달
        "GROUP BY  store_code)reg "+
        "using(store_code) "+ 
        "where status = 'Y' order by store_name";

        const params = [];

        return this.dbService.executeQuery(query, params);

    }

    async getClientStoreList(param): Promise<any>{

      const resultMultiQuery = this.dbService.executeMultiQuery(async(connection)=>{

        var searchQuery = ''

        const searchParams = []

        var keyword = ''


        if(param.keyword && param.keyword != 'all' ){
          searchQuery = 'where store_code like ? or store_name like ? or bct.name like ? '
          searchParams.push('%'+param.keyword+'%')
          searchParams.push('%'+param.keyword+'%')
          searchParams.push('%'+param.keyword+'%')
          keyword = param.keyword
        }
        
        const query1 = "select count(*) as total from boa_store bs "+
        "join boa_client_type bct on bs.client_type_id = bct.type_id join boa_user bu on bs.admin_login_id = bu.user_login_id " + searchQuery
        const params1 = searchParams
        const result1 = await this.dbService.executeQueryForShareConnection(connection, query1, params1)

        const pagingDto = new PagingDto(param.pageNum, result1[0].total, keyword)

        const query2 = "select bs.store_code, bs.store_name, bs.status,  bct.name as client_type_name, bu.user_name, bs.register_time, bs.last_update from boa_store bs "+ 
        "left join boa_client_type bct on bs.client_type_id = bct.type_id left join boa_user bu on bs.admin_login_id = bu.user_login_id "+ searchQuery +"order by bs.status desc, bs.store_name limit ?, ?"

        const startrow = pagingDto.row_amount * (pagingDto.pageNum -1)
        
        const params2 = searchParams.concat([startrow, pagingDto.row_amount])
        const result2 = await this.dbService.executeQueryForShareConnection(connection, query2, params2)

        return [pagingDto, result2]


      })

      return resultMultiQuery;

    }

    
    async updateClientStoreStatus(param): Promise<any[]>{
 
      let query = "update boa_store set status=? where "
      const params = [param.status];

      const storeCodeList = param.storeCodeList
      const addQuery = "store_code =? "

      for(var i=0; i<storeCodeList.length; i++){
        query += addQuery 
        if(storeCodeList.length -1 > i)query += "or "
        params.push(storeCodeList[i])
      }


      return this.dbService.executeQuery(query, params);

    }

    

    async getStoreDetail(param): Promise<any[]>{
 
      const query = "select bs.store_code, bs.store_name, bs.status, bs.client_type_id, bu.user_name as admin_name, bs.admin_login_id, bus.user_login_id as conn_user_id,bus.user_name as conn_user_name,  bs.register_time, bs.last_update, bs.send_phone_number from boa_store bs "+
      "left join boa_user bu on bs.admin_login_id = bu.user_login_id "+ 
      "left join (select boa_user.user_login_id,boa_user.user_name, boa_user_store.store_code from boa_user_store join boa_user on boa_user_store.user_login_id = boa_user.user_login_id) bus on bs.store_code = bus.store_code "+ 
      "where bs.store_code = ?"
      
      const params = [param.store_code];

      return this.dbService.executeQuery(query, params);

    }

    async addClientStore(body){
 
      const transactionResult = await this.dbService.executeTransaction(async (connection) => {
        const query = 'insert into boa_store(store_name, status, admin_login_id, client_type_id, store_code, send_phone_number) values(?,?,?,?,?,?)'
        const params = [body.store_name, body.status, body.admin_login_id, body.client_type_id, body.store_code, body.send_phone_number]
        const result1 = await this.dbService.executeQueryForShareConnection(connection, query, params);

        const query2 = 'insert into boa_user_store(user_login_id, store_code) values '
        
        const paramArr = body.conn_user_list
        let params2 = []
        let valueQuery ='' 

        if(paramArr.length == 0){
          return {msg : "등록성공 ::: !", code:"success"}
        }
        for(var i=0; i<paramArr.length; i++){

          const temp = paramArr[i];
          const tempArr = [temp.conn_user_id, body.store_code];
          params2 = params2.concat(tempArr);
          valueQuery += '(?, ?)'
          if(i!=paramArr.length-1)valueQuery += ','

          tempArr.length = 0

        }

        
        const result2 = await this.dbService.executeQueryForShareConnection(connection, query2+valueQuery, params2);

      })

      return transactionResult

    }


    async updateStoreDetail(body){
      console.log(body)

      const transactionResult = await this.dbService.executeTransaction(async (connection) => {
          const query = 'update boa_store set store_name = ?, status=?, admin_login_id=?, client_type_id=?, send_phone_number=? where store_code = ?'
          const params = [body.store_name, body.status, body.admin_login_id, body.client_type_id, body.send_phone_number, body.store_code]
          const result1 = await this.dbService.executeQueryForShareConnection(connection, query, params);

          const query2 = 'delete from boa_user_store where store_code = ?'
          const params2 = [body.store_code]
          const result2 = await this.dbService.executeQueryForShareConnection(connection, query2, params2);
  
          const query3 = 'insert into boa_user_store(user_login_id, store_code) values ';
  
          var valueQuery ='' 
          var params3 = []
          const paramArr = body.conn_user_list
          console.log(paramArr)
          if(paramArr.length == 0){
            return {msg : "등록성공 ::: !", code:"success"}
          }
      
  
          for(var i=0; i<paramArr.length; i++){
  
            const temp = paramArr[i];
            const tempArr = [temp.conn_user_id, body.store_code];
            params3 = params3.concat(tempArr);
            valueQuery += '(?, ?)'
            if(i!=paramArr.length-1)valueQuery += ','
  
            tempArr.length = 0
  
          }

          const result23 = await this.dbService.executeQueryForShareConnection(connection, query3+valueQuery, params3);
      })
  
      return transactionResult;
  }


    async searchUser(param): Promise<any[]>{
 
      const query = "select * from boa_user where status = 'Y' and (user_name like ? or user_login_id like ?)"
      
      const params = ['%'+param.searchWord+'%', '%'+param.searchWord+'%',];

      return this.dbService.executeQuery(query, params);

    }


    async updateClientStoreList(param): Promise<any[]>{
 
      const query = "update boa_store set store_name = ?, status=?, admin_login_id=?, client_type_id=? where store_code = ?;"
      
      const params = [param.store_name, param.status, param.admin_login_id, param.client_type_id, param.store_code];

      return this.dbService.executeQuery(query, params);

    }

     
    async getClientTypeList(param): Promise<any[]>{
 
      const query = "select name, memo, type_id as id, status from boa_client_type"
      const params = [];

      return this.dbService.executeQuery(query, params);

    }

  async updateClientType(paramArr){

    const transactionResult = await this.dbService.executeTransaction(async (connection) => {
        const query = 'delete from boa_client_type'
        const params = []
        const result1 = await this.dbService.executeQueryForShareConnection(connection, query, params);

        const query2 = 'insert into boa_client_type(name, memo, status, type_id) values';

        var valueQuery ='' 
        var  params2 = []

        for(var i=0; i<paramArr.length; i++){

          const temp = paramArr[i];
          const tempArr = [temp.name, temp.memo, temp.status, i+1];
          params2 = params2.concat(tempArr);
          valueQuery += '(?, ?, ?, ?)'
          if(i!=paramArr.length-1)valueQuery += ','

          tempArr.length = 0

        }

        const result2 = await this.dbService.executeQueryForShareConnection(connection, query2+valueQuery, params2);

    })

    return transactionResult;
}


  async getRoleTypeList(param): Promise<any[]>{
  
    const query = "select role_name, memo, status, role_id, role_type from boa_role"
    const params = [];

    return this.dbService.executeQuery(query, params);

  }

  async getRoleDetail(param): Promise<any[]>{
  
    const query = "select br.*, brm.menu_id, brm.menu_name, brm.menu_type from boa_role br "+ 
    "left join (select boa_role_menu.*, bm.menu_name, bm.menu_type from boa_role_menu join boa_menu bm using(menu_id)) brm using(role_id) where role_id = ?"
    const params = [param.role_id];

    return this.dbService.executeQuery(query, params);

  }


  
  async addRole(param): Promise<any[]>{

    
    const transactionResult = await this.dbService.executeTransaction(async (connection) => {
      const query = 'insert into boa_role(role_name, status, memo, role_type) values(?,?,?,?)';
      const params = [param.role_name, param.status, param.memo, param.role_type]
      const result1 = await this.dbService.executeQueryForShareConnection(connection, query, params);



      const query2 = 'insert into boa_role_menu(role_id, menu_id, role_name) values';

      let valueQuery ='' 
      let params2 = []

      const paramArr = param.conn_menu_list

      if(paramArr.length == 0){
        return {msg:"선택된 메뉴가 없음 :: ! ", code:"fail"}
      }

      for(var i=0; i<paramArr.length; i++){

        const temp = paramArr[i];
        const tempArr = [result1.insertId,temp.menu_id, param.role_name];//insertId 생성한 role_id(insertId)를 가져옴
        params2 = params2.concat(tempArr);
        valueQuery += '(?, ?, ?)'
        if(i!=paramArr.length-1)valueQuery += ','

        tempArr.length = 0

      }

      const result2 = await this.dbService.executeQueryForShareConnection(connection, query2+valueQuery, params2);

      return {msg:"저장성공 :: ! ", code:"success"}

  })

    return transactionResult
  }

  async updateRoleType(param){

    const transactionResult = await this.dbService.executeTransaction(async (connection) => {

      const query = 'update boa_role set role_name=?, status=?, memo=?, role_type=? where role_id = ?';
      const params = [param.role_name, param.status, param.memo, param.role_type, param.role_id]
      const result1 = await this.dbService.executeQueryForShareConnection(connection, query, params);

      const paramArr = param.conn_menu_list

      if(paramArr.length == 0){
        return {msg:"저장성공 :: !" , code : "success"}
      }

      const query2 = 'delete from boa_role_menu where role_id = ?'
      const params2 = [param.role_id]
      const result2 = await this.dbService.executeQueryForShareConnection(connection, query2, params2);

      const query3 = 'insert into boa_role_menu(role_id, menu_id, role_name) values';

  
      let valueQuery ='' 
      let params3 = []

      for(let i=0; i<paramArr.length; i++){

        const temp = paramArr[i];
        const tempArr = [param.role_id, temp.menu_id, param.role_name];
        params3 = params3.concat(tempArr);
        valueQuery += '(?, ?, ?)'
        if(i!=paramArr.length-1)valueQuery += ','

        tempArr.length = 0

      }

      const result3 = await this.dbService.executeQueryForShareConnection(connection, query3+valueQuery, params3);

      return {msg:"저장성공 :: !" , code : "success"}

    })

    return transactionResult;
  }


  async getMediaList(param): Promise<any[]>{
  
    const query = "select media_name as name, memo, status, media_id as id from boa_media"
    const params = [];

    return this.dbService.executeQuery(query, params);

  }

  async updateMedia(paramArr){

    const transactionResult = await this.dbService.executeTransaction(async (connection) => {
        const query = 'delete from boa_media'
        const params = []
        const result1 = await this.dbService.executeQueryForShareConnection(connection, query, params);

        const query2 = 'insert into boa_media(media_name, status, media_id, memo) values';

        var valueQuery ='' 
        var  params2 = []

        for(var i=0; i<paramArr.length; i++){

          const temp = paramArr[i];
          const tempArr = [temp.name, temp.status, i+1, temp.memo];
          params2 = params2.concat(tempArr);
          valueQuery += '(?, ?, ?, ?)'
          if(i!=paramArr.length-1)valueQuery += ','

          tempArr.length = 0

        }

        const result2 = await this.dbService.executeQueryForShareConnection(connection, query2+valueQuery, params2);

    })

    return transactionResult;
  }

  async getAccountList(param): Promise<any[]>{

    const resultMultiQuery = this.dbService.executeMultiQuery(async(connection)=>{

      let searchQuery = ''

      const searchParams = []

      let keyword = ''

      if(param.keyword){
        searchQuery = 'where user_login_id like ? or user_name like ? or role_name like ? '
        searchParams.push('%'+param.keyword+'%')
        searchParams.push('%'+param.keyword+'%')
        searchParams.push('%'+param.keyword+'%')
        keyword = param.keyword
      }
      
      const query1 = "select count(*) as total from boa_user bu join boa_role br using(role_id) "+ searchQuery
      const params1 = searchParams
      const result1 = await this.dbService.executeQueryForShareConnection(connection, query1, params1)

      const pagingDto = new PagingDto(param.pageNum, result1[0].total, keyword)

      const query2 = "select user_id, user_login_id, user_name, bu.status, role_name from boa_user bu join boa_role br using(role_id) "+ searchQuery+" order by bu.status desc, user_id limit ?, ?"

      const startrow = pagingDto.row_amount * (pagingDto.pageNum -1)
      
      const params2 = searchParams.concat([startrow, pagingDto.row_amount])
      const result2 = await this.dbService.executeQueryForShareConnection(connection, query2, params2)

      return [pagingDto, result2]


    })

    return resultMultiQuery;
  
  }

  async getAccountDetail(param): Promise<any[]>{
 
    const query = "select user_id, user_login_id, user_name, bu.status,role_id, role_name, bus.store_code, store_name from boa_user bu join boa_role br using(role_id) "+
    "left join (select user_login_id, boa_store.store_code, boa_store.store_name from boa_user_store join boa_store using(store_code))bus "+
    "using(user_login_id) where user_id = ?"
    
    const params = [param.user_id];

    return this.dbService.executeQuery(query, params);

  }

  async searchStore(param): Promise<any[]>{

    if(param.searchWord != 'all'){
      const query = "select * from boa_store where status = 'Y' and (store_name like ?)"
      const params = ['%'+param.searchWord+'%'];
      return this.dbService.executeQuery(query, params);
    }else{

      const query = "select * from boa_store where status = 'Y'"
      const params = [];
      return this.dbService.executeQuery(query, params);
    }

    

  }


  async updateAccountDetail(body){

    const transactionResult = await this.dbService.executeTransaction(async (connection) => {
        let query = ''

        let params = []

        if(body.user_password){
          const password = body.user_password;
          const hashPassword = await bcrypt.hashSync(password, 10)
      
          params = [body.user_name, body.status, body.role_id, hashPassword, body.user_id]
          query = 'update boa_user set user_name = ?, status=?, role_id=?, user_password=? where user_id = ?'
        }else{
          params = [body.user_name, body.status, body.role_id, body.user_id]
          query = 'update boa_user set user_name = ?, status=?, role_id=? where user_id = ?'
        }

        const result1 = await this.dbService.executeQueryForShareConnection(connection, query, params);



        const query2 = 'delete from boa_user_store where user_login_id = ?'
        const params2 = [body.user_login_id]
        const result2 = await this.dbService.executeQueryForShareConnection(connection, query2, params2);

        const query3 = 'insert into boa_user_store(user_login_id, store_code) values ';

        var valueQuery ='' 
        var params3 = []

        const paramArr = body.conn_store_list

        if(paramArr.length == 0){
          return {msg : "등록성공 ::: !", code:"success"}
        }
    

        for(var i=0; i<paramArr.length; i++){
          

          const temp = paramArr[i];
          if(temp.store_code){
            const tempArr = [body.user_login_id, temp.store_code];
            params3 = params3.concat(tempArr);
            valueQuery += '(?, ?)'
            tempArr.length = 0

            if(i!=paramArr.length-1)valueQuery += ','

          }


        }

        if(params3.length == 0){
          return {msg : "등록성공 ::: !", code:"success"}
        }

        const result23 = await this.dbService.executeQueryForShareConnection(connection, query3+valueQuery, params3);

    })

    return transactionResult;
}

async addACcount(body){
 
  const transactionResult = await this.dbService.executeTransaction(async (connection) => {

    const checkQuery = "select * from boa_user where user_login_id = ?"
    const checkQueryParams = [body.user_login_id]
    const checkRows = await this.dbService.executeQueryForShareConnection(connection, checkQuery, checkQueryParams);
    if(checkRows.length > 0){
      return {msg : "이미 존재하는 아이디!", code : "fail"}
    }

    const password = body.user_password;

    const hashPassword = await bcrypt.hash(password, 10)

    const query = 'insert into boa_user(user_login_id, user_name, user_password, role_id, status) values(?,?,?,?,?)'
    const params = [body.user_login_id, body.user_name, hashPassword, body.role_id, body.status]
    const result1 = await this.dbService.executeQueryForShareConnection(connection, query, params);

    const query2 = 'insert into boa_user_store(user_login_id, store_code) values '

    // if(paramArr && paramArr.paramArr)
    
    const paramArr = body.conn_store_list
    // console.log("paramArr", paramArr)
    let params2 = []
    let valueQuery =''
    
    if(paramArr.length == 0){
      return {msg : "등록성공 ::: !", code:"success"}
    }

    for(var i=0; i<paramArr.length; i++){
          

      const temp = paramArr[i];
      if(temp.store_code){
        const tempArr = [body.user_login_id, temp.store_code];
        params2 = params2.concat(tempArr);
        valueQuery += '(?, ?)'
        tempArr.length = 0

        if(i!=paramArr.length-1)valueQuery += ','

      }

    }

    if(params2.length == 0){
      return {msg : "등록성공 ::: !", code:"success"}
    }

    const result2 = await this.dbService.executeQueryForShareConnection(connection, query2+valueQuery, params2);
    return {msg : "등록성공 ::: !", code:"success"}
  })

  return transactionResult

}

    async getBoaPageList(): Promise<any[]> {
        const query = "select * from boa_page";
        const params = [];
        return this.dbService.executeQuery(query, params);
    }



  



     
}
