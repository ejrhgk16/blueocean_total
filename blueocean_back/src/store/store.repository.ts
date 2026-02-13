import { Injectable } from "@nestjs/common"
import { Panorama } from "aws-sdk";
import { Console } from "console";
import { DbService } from "src/common/db/db.service";
import { PagingDto } from "src/common/paging/paging.dto";

@Injectable()
export class StoreRepository {

  // status
  // '01' : {value:'01', text:'대기'},
  // '02': {value:'02', text:'리콜대기'},
  // '03': {value:'03', text:'부재'},
  // '04':{value:'04', text:'예약'},
  // '05' : {value:'05', text:'무효'}
  // 99 : 비활성화 - 카운팅, 디비리스트에서 조회 되면안됨

    constructor(
        private readonly dbService : DbService
     ){}
 
     async getStoreDBList(param): Promise<any[]>{

      // console.log(param)

        const resultMultiQuery = this.dbService.executeMultiQuery(async(connection)=>{


            let query1 = "select count(*) as total from boa_reg_info bri "+
            "where store_code = ? and status != '99' and (last_update >= DATE_FORMAT(?, '%Y-%m-%d') and last_update <= DATE_FORMAT(? + INTERVAL 1 DAY, '%Y-%m-%d'))" 
            
            let params = [param.store_code, param.startDate, param.endDate]

            let addQuery = '' 
            if(param.round_num && param.round_num != "all"){
              addQuery = 'and round_num = ? '
              params.push(param.round_num)
            }

            let searchQuery = ''
    
            const searchParams = []
    
            let keyword = ''

    
            if(param.keyword){
              searchQuery = ' and (cust_name like ? or cust_phone_number like ? ) '
              searchParams.push('%'+param.keyword+'%')
              searchParams.push('%'+param.keyword+'%')
              keyword = param.keyword 
            }

            const params1 = params.concat(searchParams)
            const result1 = await this.dbService.executeQueryForShareConnection(connection, query1+ addQuery + searchQuery, params1)

            // console.log("total :: ", result1[0].total)
    
    
            const pagingDto = new PagingDto(param.pageNum, result1[0].total, keyword)

            // console.log("pagingDto :: ", pagingDto)
    
            const query2 = "select bri.*, page_code, page_name, event_num, media_name, event_name from boa_reg_info bri left join (select page_code, page_name, event_num, media_name from boa_page left join boa_media using(media_id)) bp using(page_code) "+
            "left join (select num, event_name from boa_event where store_code = ?)be on be.num = bp.event_num "+
            "where store_code = ? and status != '99' and (last_update >= DATE_FORMAT(?, '%Y-%m-%d') and last_update <= DATE_FORMAT(? + INTERVAL 1 DAY, '%Y-%m-%d')) "
            + addQuery + searchQuery + "order by last_update desc limit ?, ?"
        
            const startrow = pagingDto.row_amount * (pagingDto.pageNum -1)
            
            const params2 = params.concat(searchParams.concat([startrow, pagingDto.row_amount]))
            params2.unshift(param.store_code)
            const result2 = await this.dbService.executeQueryForShareConnection(connection, query2, params2)
            
            return [pagingDto, result2]
    
    
          })
    
          return resultMultiQuery;
 
     }

     async getDBDetail(param): Promise<any[]>{

      const query = "select * from boa_reg_info bri left join (select page_code, page_name, event_num, event_name, media_name from boa_page "+ 
        "left join boa_media using(media_id) left join (select * from boa_event where store_code =?)be on boa_page.event_num = be.num) bp using(page_code) where id = ?"
      const params = [param.store_code, param.id];

      return this.dbService.executeQuery(query, params);

    }

    async updateDBDetail(param): Promise<any[]>{
 
      const query = "update boa_reg_info set status=?, memo=? where id = ?"
      const params = [param.status, param.memo, param.id];

      return this.dbService.executeQuery(query, params);

    }


    async getDbRoundList(param): Promise<any[]>{
 
      const query = "select * from boa_round where store_code = ?"
      const params = [param.store_code];

      return this.dbService.executeQuery(query, params);

    }

    async updateDBRound(param):Promise<any[]>{
      const transactionResult = await this.dbService.executeTransaction(async (connection) => {
        const query = 'delete from boa_round where store_code = ?'
        const params = [param.store_code]
        const result1 = await this.dbService.executeQueryForShareConnection(connection, query, params);

        const query2 = 'insert into boa_round(store_code, round_num, round_quantity) values';

        var valueQuery ='' 
        var  params2 = []

        const paramArr = param.dataList

        for(var i=0; i<paramArr.length; i++){

          const temp = paramArr[i];
          const tempArr = [param.store_code, temp.round_num, temp.round_quantity];
          params2 = params2.concat(tempArr);
          valueQuery += '(?, ?, ?)'
          if(i!=paramArr.length-1)valueQuery += ','

          tempArr.length = 0

        }


        const result2 = await this.dbService.executeQueryForShareConnection(connection, query2+valueQuery, params2);

    })

    return transactionResult;
    }

    async getDBRoundInfoList(param): Promise<any[]>{
 
      const query = "select round_num, round_quantity, ifnull(count, 0)as count from( "+
      "SELECT * FROM boa_round WHERE store_code = ? " +
      "UNION "+
      "SELECT '', 0, 0, NULL "+
      "ORDER BY round_num)br "+
      "left join "+
      "(select round_num, count(*) as count from boa_reg_info where store_code = ? and status != '99' group by round_num)bri using(round_num) "+
      "ORDER by CASE WHEN round_num = 0 THEN 0 ELSE 1 END, round_num DESC  "

      const params = [param.store_code, param.store_code];

      return this.dbService.executeQuery(query, params);

    }

    async getStatusCountList(param): Promise<any[]>{
 
      const query = `select status_code, text, ifnull(count, 0)as count from( 
        SELECT * FROM boa_reg_status)brs
        left join 
        (select status, count(*) as count from boa_reg_info where store_code = ? group by status)bri on brs.status_code = bri.status
       order by status_code `

      const params = [param.store_code];

      return this.dbService.executeQuery(query, params);

    }

    //status도 이걸로
    async updateRegInfoRound(param):Promise<any[]>{
      const transactionResult = await this.dbService.executeTransaction(async (connection) => {

        const query = 'update boa_reg_info set round_num = ? where '
        const params = [param.round_num]


        const paramArr = param.idList
        let addQuery = ''

        for(var i=0; i<paramArr.length; i++){

          const temp = paramArr[i];
          params.push(temp)
          addQuery += 'id = ? '
          if(i!=paramArr.length-1)addQuery += '||'

        }


        const result1 = await this.dbService.executeQueryForShareConnection(connection, query+addQuery, params);


    })
    
    return transactionResult;
  }

  async updateStatus(param):Promise<any[]>{
    const transactionResult = await this.dbService.executeTransaction(async (connection) => {

      const query = 'update boa_reg_info set status = ? where '
      const params = [param.status]


      const paramArr = param.idList
      let addQuery = ''

      for(var i=0; i<paramArr.length; i++){

        const temp = paramArr[i];
        params.push(temp)
        addQuery += 'id = ? '
        if(i!=paramArr.length-1)addQuery += '||'

      }


      const result1 = await this.dbService.executeQueryForShareConnection(connection, query+addQuery, params);


  })
  
   return transactionResult;
  }

  async getDBManageList(param): Promise<any[]>{

    const resultMultiQuery = this.dbService.executeMultiQuery(async(connection)=>{

        let query1 = "select count(*) as total from boa_reg_info bri "+
        "where store_code = ? and (last_update >= DATE_FORMAT(?, '%Y-%m-%d') and last_update <= DATE_FORMAT(? + INTERVAL 1 DAY, '%Y-%m-%d'))" 
        
        let params = [param.store_code, param.startDate, param.endDate]

        let addQuery = '' 
        if(param.round_num && param.round_num != "all"){
          addQuery = 'and round_num = ? '
          params.push(param.round_num)
        }

        if(param.status && param.status != "all"){
          addQuery = 'and status = ? '
          params.push(param.status)
        }

        let searchQuery = ''

        const searchParams = []

        let keyword = ''


        if(param.keyword){
          searchQuery = ' and (cust_name like ? or cust_phone_number like ? ) '
          searchParams.push('%'+param.keyword+'%')
          searchParams.push('%'+param.keyword+'%')
          keyword = param.keyword 
        }

        const params1 = params.concat(searchParams)
        const result1 = await this.dbService.executeQueryForShareConnection(connection, query1+ addQuery + searchQuery, params1)

        const pagingDto = new PagingDto(param.pageNum, result1[0].total, keyword)

        const query2 = "select bri.*, page_code, page_name, event_num, media_name, event_name  from boa_reg_info bri left join (select page_code, page_name, event_num, media_name from boa_page left join boa_media using(media_id)) bp using(page_code) "+
        "left join (select num, event_name from boa_event where store_code = ?)be on be.num = bp.event_num " +
        "where store_code = ? and (last_update >= DATE_FORMAT(?, '%Y-%m-%d') and last_update <= DATE_FORMAT(? + INTERVAL 1 DAY, '%Y-%m-%d')) "
        + addQuery + searchQuery + "order by last_update desc limit ?, ?"
    
        const startrow = pagingDto.row_amount * (pagingDto.pageNum -1)
        
        const params2 = params.concat(searchParams.concat([startrow, pagingDto.row_amount]))
        params2.unshift(param.store_code)
        const result2 = await this.dbService.executeQueryForShareConnection(connection, query2, params2)
        
        return [pagingDto, result2]


      })

      return resultMultiQuery;

 }

 
 async addDBRegInfoData(param): Promise<any[]>{
  // console.log(param)
  const query = "insert into boa_reg_info(store_code, cust_name, cust_phone_number, info_data, round_num, status, page_code) values(?,?,?,?, 0, '01', ?)"
  const params = [param.store_code, param.cust_name, param.cust_phone_number, param.info_data, param.page_code];

  return this.dbService.executeQuery(query, params);

  }

  async deliveryList(param): Promise<any[]>{


    const query = "select * from boa_reg_info where "
    const params = [];

    let addQuery = ''
    const paramArr = param.list ? param.list.split(',') : [] //문자열배열변환

    for(var i=0; i<paramArr.length; i++){

      const temp = paramArr[i];
      params.push(temp)
      addQuery += 'id = ? '
      if(i!=paramArr.length-1)addQuery += '||'

    }
  
    return this.dbService.executeQuery(query + addQuery, params);
  
   }

   async getPageList(param): Promise<any[]>{
 
    const query = "select * from boa_page where store_code = ?"

    const params = [param.store_code];

    return this.dbService.executeQuery(query, params);

  }

  async updateDelivery(param):Promise<any[]>{
    const transactionResult = await this.dbService.executeTransaction(async (connection) => {

      const query = 'insert into boa_reg_info(page_code, store_code, info_data, cust_name, cust_phone_number, memo) values'
      let params = []


      const paramArr = param.deliveryList

      let addQuery = ''

      for(var i=0; i<paramArr.length; i++){



        const temp = paramArr[i];

        const info_data = temp.info_data
        const tempArr = [param.page_code, param.store_code, info_data, temp.cust_name, temp.cust_phone_number, temp.memo];
        params = params.concat(tempArr);
        addQuery += '(?, ?, ?, ?, ?, ?)'
        if(i!=paramArr.length-1)addQuery += ','

        tempArr.length = 0

      }


      const result1 = await this.dbService.executeQueryForShareConnection(connection, query+addQuery, params);


  })
  
  return transactionResult;
}


async getStoreRegInfo(param): Promise<any[]>{
 
  const query = "SELECT store_code,"+
  "COUNT(CASE WHEN DATE(last_update) = CURDATE() THEN 1 ELSE NULL END) AS today_count, "+
  "COUNT(CASE WHEN DATE(last_update) = CURDATE() - INTERVAL 1 DAY THEN 1 ELSE NULL END) AS yesterday_count, "+
  "COUNT(CASE WHEN DATE_FORMAT(last_update, '%Y-%m') = DATE_FORMAT(current_date() , '%Y-%m') THEN 1 ELSE NULL END) AS month_count, "+ 
  "COUNT(CASE WHEN (status = '01' OR status IS NULL) THEN 1 ELSE NULL END) AS status_01_count " +
  "FROM boa_reg_info "+
  "where store_code = ? and status != '99'"

  const params = [param.store_code];

  return this.dbService.executeQuery(query, params);

}

async getDashBoardChartDataByWeek(param): Promise<any[]>{
 
  const query = `
  SELECT 
      CONCAT(year, '-', LPAD(week_number, 2, '0')) AS year_week,
      CONCAT(week_start, ' ~ ', week_end) AS date, 
      IFNULL(count, 0) AS count 
  FROM (    
      SELECT     
          YEAR(DATE_SUB(CURDATE(), INTERVAL n WEEK)) AS year,
          WEEK(DATE_SUB(CURDATE(), INTERVAL n WEEK), 1) AS week_number,    
          DATE_FORMAT(DATE_ADD(DATE_SUB(CURDATE(), INTERVAL n WEEK), INTERVAL - WEEKDAY(DATE_SUB(CURDATE(), INTERVAL n WEEK)) DAY), '%m-%d') AS week_start,    
          DATE_FORMAT(DATE_ADD(DATE_SUB(CURDATE(), INTERVAL n WEEK), INTERVAL (6 - WEEKDAY(DATE_SUB(CURDATE(), INTERVAL n WEEK))) DAY), '%m-%d') AS week_end    
      FROM (    
          SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 
          UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 
          UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11    
      ) AS weeks 
  ) weeks_all    
  LEFT JOIN     
  (
      SELECT 
          store_code, 
          YEAR(last_update) AS year,
          WEEK(last_update, 1) AS week_number,    
          CONCAT(DATE_FORMAT(last_update, '%m월 '), WEEK(last_update) - WEEK(DATE_SUB(last_update, INTERVAL DAYOFMONTH(last_update)-1 DAY))+1, '주차') AS week_label,    
          COUNT(WEEK(last_update)) AS count    
      FROM boa_reg_info    
      WHERE store_code = ? and status != '99'
      GROUP BY store_code, year, week_label, week_number
  ) reg_info    
  USING (year, week_number) 
  ORDER BY year, week_number
  `;
  
// 시작일 (week_start):

// WEEKDAY(DATE_SUB(CURDATE(), INTERVAL n WEEK))는 주어진 날짜의 요일을 반환합니다.
// -WEEKDAY(...)는 해당 요일의 값을 음수로 바꿔서 그 주의 월요일로 돌아갑니다.
// 예를 들어, WEEKDAY가 3(수요일)을 반환하면 -3이 되므로 3일 전인 월요일로 이동합니다.
// 종료일 (week_end):

// 6 - WEEKDAY(...)는 해당 주의 일요일까지 남은 일수를 계산합니다.
// 예를 들어, WEEKDAY가 3(수요일)이면 6 - 3 = 3이 되어 3일 후인 일요일로 이동합니다.


  const params = [param.store_code];

  return this.dbService.executeQuery(query, params);

}

async getDashBoardChartDataByMonth(param): Promise<any[]>{

  
 
  const query = "SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL n MONTH), '%Y-%m') as date, COUNT(boa_reg_info.last_update) AS count FROM ( " +
  "SELECT 0 AS n " + 
  "UNION ALL SELECT 1 " +
  "UNION ALL SELECT 2 " +
  "UNION ALL SELECT 3 " +
  "UNION ALL SELECT 4 " +
  "UNION ALL SELECT 5 " +
  "UNION ALL SELECT 6 " +
  "UNION ALL SELECT 7 " +
  "UNION ALL SELECT 8 " +
  "UNION ALL SELECT 9 " +
  "UNION ALL SELECT 10 " +
  "UNION ALL SELECT 11 " +
  ") AS months " +
  "LEFT JOIN (select * from boa_reg_info where store_code = ? and status != '99')boa_reg_info "+
  "ON DATE_FORMAT(boa_reg_info.last_update, '%Y-%m') = DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL n MONTH), '%Y-%m') " +
  "GROUP BY date " +
  "ORDER BY date " 

  const params = [param.store_code];

  return this.dbService.executeQuery(query, params);

}

async getDashBoardChartDataByDay(param): Promise<any[]>{

  const query = "SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL n DAY), '%y/%m/%d') as date, COUNT(boa_reg_info.last_update) AS count FROM ( " +
  "SELECT 0 AS n " + 
  "UNION ALL SELECT 1 " +
  "UNION ALL SELECT 2 " +
  "UNION ALL SELECT 3 " +
  "UNION ALL SELECT 4 " +
  "UNION ALL SELECT 5 " +
  "UNION ALL SELECT 6 " +
  "UNION ALL SELECT 7 " +
  "UNION ALL SELECT 8 " +
  "UNION ALL SELECT 9 " +
  "UNION ALL SELECT 10 " +
  "UNION ALL SELECT 11 " +
  "UNION ALL SELECT 12 " +
  "UNION ALL SELECT 13 " +
  "UNION ALL SELECT 14 " +
  "UNION ALL SELECT 15 " +
  "UNION ALL SELECT 16 " +
  "UNION ALL SELECT 17 " +
  "UNION ALL SELECT 18 " +
  "UNION ALL SELECT 19 " +
  "UNION ALL SELECT 20 " +
  "UNION ALL SELECT 21 " +
  "UNION ALL SELECT 22 " +
  "UNION ALL SELECT 23 " +
  "UNION ALL SELECT 24 " +
  "UNION ALL SELECT 25 " +
  "UNION ALL SELECT 26 " +
  "UNION ALL SELECT 27 " +
  "UNION ALL SELECT 28 " +
  "UNION ALL SELECT 29 " +
  ") AS months " +
  "LEFT JOIN (select * from boa_reg_info where store_code = ? and status != '99')boa_reg_info "+
  "ON DATE_FORMAT(boa_reg_info.last_update, '%Y-%m-%d') = DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL n DAY), '%Y-%m-%d') " +
  "GROUP BY date " +
  "ORDER BY date " 

  const params = [param.store_code];

  return this.dbService.executeQuery(query, params);

}


  async getPageStatsList22222(param): Promise<any[]>{
  
    const query = "select page_id, page_code, page_name, reg_count, visit_count, media_name, bp.status, event_num "+
    "FROM ( "+
    "SELECT boa_page.*, boa_media.media_name "+
        "FROM boa_page " +
        "left JOIN boa_media USING(media_id) where store_code = ?  " +
    ") bp " + 
    "LEFT JOIN boa_visit USING(page_code) " +
    "left JOIN ( " +
      "select page_code, count(*) as reg_count from boa_reg_info where store_code = ? group by page_code " +
    ") bri " +
    "USING(page_code)"

    const params = [param.store_code, param.store_code];

    return this.dbService.executeQuery(query, params);

  }

  async getPageStatsList(param): Promise<any[]>{


    const resultMultiQuery = this.dbService.executeMultiQuery(async(connection)=>{


        let query1 = "select count(*) as total from boa_page left JOIN boa_media USING(media_id) where store_code = ?  "
        
        let params = [param.store_code]

        let searchQuery = ''

        const searchParams = []

        let keyword = ''
        if(param.keyword){

          searchQuery = ' and (page_code like ? or page_name like ? or page_name like ? or media_name like ? ) '
          searchParams.push('%'+param.keyword+'%')
          searchParams.push('%'+param.keyword+'%')
          searchParams.push('%'+param.keyword+'%')
          searchParams.push('%'+param.keyword+'%')
          keyword = param.keyword 
        }

        const params1 = params.concat(searchParams)
        const result1 = await this.dbService.executeQueryForShareConnection(connection, query1 + searchQuery, params1)

        const pagingDto = new PagingDto(param.pageNum, result1[0].total, keyword)

        const query2 = "select page_id, page_code, page_name, IFNULL(reg_count_total,0) as reg_count_total, IFNULL(reg_count_period,0) as reg_count_period,  visit_count, media_name, bp.status, event_name, bp.last_update, bp.url "+
        "FROM ( "+
        "SELECT boa_page.*, boa_media.media_name "+
            "FROM boa_page " +
            "left JOIN boa_media USING(media_id) where store_code = ?  " + searchQuery +
        ") bp " + 
        "left join (select num, event_name from boa_event where store_code = ?) be on be.num = bp.event_num " +
        "left JOIN ( " +
          "select page_code, count(*) as reg_count_total from boa_reg_info where store_code = ? and status != '99' group by page_code " +
        ") bri " +
        "USING(page_code) " +
        "left JOIN ( " +
        "select page_code, count(*) as reg_count_period from boa_reg_info where store_code = ?  and status != '99' and (last_update >= DATE_FORMAT(?, '%Y-%m-%d') and last_update <= DATE_FORMAT(? + INTERVAL 1 DAY, '%Y-%m-%d'))  " +
        " group by page_code " +
        ") bri2 " +
        "USING(page_code) " +
        "order by bp.status desc, bp.last_update desc limit ?, ?" 
    
        const startrow = pagingDto.row_amount * (pagingDto.pageNum -1)
        
        const params2 = params.concat(searchParams.concat([param.store_code, param.store_code,  param.store_code,  param.startDate, param.endDate, startrow, pagingDto.row_amount]))
 
        const result2 = await this.dbService.executeQueryForShareConnection(connection, query2, params2)

       
        
        return [pagingDto, result2]


      })

      return resultMultiQuery;

 }

 async getAdPageList(param): Promise<any[]>{


  const resultMultiQuery = this.dbService.executeMultiQuery(async(connection)=>{


      let query1 = "select count(*) as total from boa_page left JOIN boa_media USING(media_id) where store_code = ?  "
      
      let params = [param.store_code]

      let searchQuery = ''

      const searchParams = []

      let keyword = ''
      if(param.keyword){

        searchQuery = ' and (page_code like ? or page_name like ? or page_name like ? or media_name like ? ) '
        searchParams.push('%'+param.keyword+'%')
        searchParams.push('%'+param.keyword+'%')
        searchParams.push('%'+param.keyword+'%')
        searchParams.push('%'+param.keyword+'%')
        keyword = param.keyword 
      }

      const params1 = params.concat(searchParams)
      const result1 = await this.dbService.executeQueryForShareConnection(connection, query1 + searchQuery, params1)

      const pagingDto = new PagingDto(param.pageNum, result1[0].total, keyword)

      const query2 = "select page_id, page_code, page_name, media_name, bp.status, event_name, bp.last_update, bp.url "+
      "FROM ( "+
      "SELECT boa_page.*, boa_media.media_name "+
          "FROM boa_page " +
          "left JOIN boa_media USING(media_id) where store_code = ?  " + searchQuery +
      ") bp " + 
      "left join (select num, event_name from boa_event where store_code = ?) be on be.num = bp.event_num " +
      "order by bp.status desc, bp.last_update desc limit ?, ?" 
  
      const startrow = pagingDto.row_amount * (pagingDto.pageNum -1)
      
      const params2 = params.concat(searchParams.concat([param.store_code,startrow, pagingDto.row_amount]))
      const result2 = await this.dbService.executeQueryForShareConnection(connection, query2, params2)

     
      
      return [pagingDto, result2]


    })

    return resultMultiQuery;

}

async addAd(param){
  const transactionResult = await this.dbService.executeTransaction(async (connection) => {

    let query = "INSERT INTO boa_page (page_code, store_code, page_name, url, media_id, status, event_num, replace_page_code, script_num, privacy_num, next_url, script_num_comp, api_num, limit_age, block_keyword, ageYN, privacy01checkYN, privacy02checkYN)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    const params = [param.page_code, param.store_code, param.page_name, param.url, param.media_id, param.status, param.event_num, param.replace_page_code, param.script_num, param.privacy_num, param.next_url, param.script_num_comp, param.api_num, param.limit_age, param.block_keyword, param.ageYN, param.privacy01checkYN, param.privacy02checkYN]
    // console.log(param)
    const result1 = await this.dbService.executeQueryForShareConnection(connection, query, params);
   
    const query3 = 'insert into boa_content(page_code, content_type, content_name, content_text, content_img_name, content_img_path) values';

    let valueQuery ='' 
    let  params3 = []

    for(let i=0; i<param.insert_db_list.length; i++){

      const temp = param.insert_db_list[i]

      const tempArr = [param.page_code, temp.content_type, temp.content_name, temp.content_text, temp.content_img_name, temp.content_img_path];
      params3 = params3.concat(tempArr);
      valueQuery += '(?, ?, ?, ? ,?, ?)'
      if(i!=param.insert_db_list.length-1)valueQuery += ','

      tempArr.length = 0

    }

    if(param.insert_db_list.length > 0){

      const result3 = await this.dbService.executeQueryForShareConnection(connection, query3+valueQuery, params3);
    }


    return {msg : "등록성공 ::: !", code:"success"}

})


  return transactionResult
}

async getAdPageDetail(param): Promise<any[]>{

  const resultMultiQuery = this.dbService.executeMultiQuery(async(connection)=>{


      let query1 = "select * from boa_page where page_code = ?  "
      
      let params = [param.page_code]

      const result1 = await this.dbService.executeQueryForShareConnection(connection, query1, params)

      const query2 = "select * from boa_content  where page_code = ?"
   
      const result2 = await this.dbService.executeQueryForShareConnection(connection, query2, params)



      return [result1, result2]


    })

    return resultMultiQuery;

}

async updateAd(param){
  // console.log("updateAd",param)
  // const transactionResult = await this.dbService.executeTransaction(async (connection) => {
  //   let query = "update boa_page set page_name=?, media_id=?, status=?, event_num=?, replace_page_code=?, script_num =?, privacy_num=?, next_url=?, script_num_comp=?, limit_age=?, block_keyword=?, api_num=?  where page_code = ?"
  //   const params = [param.page_name, param.media_id, param.status, param.event_num, param.replace_page_code, param.script_num, param.privacy_num, param.next_url, param.script_num_comp, param.limit_age, param.block_keyword, param.api_num, param.page_code]
  //   const result1 = await this.dbService.executeQueryForShareConnection(connection, query, params);

  //   const query2 = 'update boa_content set content_type=?, content_name=?, content_text=?, content_img_name=?, content_img_path=? where page_code = ? && content_name = ?';

  //   for(let i=0; i<param.update_db_list.length; i++){

  //     const temp = param.update_db_list[i]

  //     const params2 = [temp.content_type, temp.content_name, temp.content_text, temp.content_img_name, temp.content_img_path, param.page_code, temp.content_origin_name];
  //     const result2 = await this.dbService.executeQueryForShareConnection(connection, query2, params2);
  //     params2.length = 0
  //   }

  //   const query3 = 'insert into boa_content(page_code, content_type, content_name, content_text, content_img_name, content_img_path) values';

  //   let valueQuery ='' 
  //   let  params3 = []

  //   for(let i=0; i<param.insert_db_list.length; i++){

  //     const temp = param.insert_db_list[i]

  //     const tempArr = [param.page_code, temp.content_type, temp.content_name, temp.content_text, temp.content_img_name, temp.content_img_path];
  //     params3 = params3.concat(tempArr);
  //     valueQuery += '(?, ?, ?, ? ,?, ?)'
  //     if(i!=param.insert_db_list.length-1)valueQuery += ','

  //     tempArr.length = 0

  //   }

  //   if(param.insert_db_list.length > 0){

  //     const result3 = await this.dbService.executeQueryForShareConnection(connection, query3+valueQuery, params3);
  //   }



  //   return {msg : "등록성공 ::: !", code:"success", path:"/landing/"+param.store_code+"/"+param.page_code}

  // })

  // return transactionResult

    const transactionResult = await this.dbService.executeTransaction(async (connection) => {

      let query = "update boa_page set page_name=?, media_id=?, status=?, event_num=?, replace_page_code=?, script_num =?, privacy_num=?, next_url=?, script_num_comp=?, limit_age=?, block_keyword=?, api_num=?, ageYN=?, privacy01checkYN=?, privacy02checkYN=?  where page_code = ?"
      const params = [param.page_name, param.media_id, param.status, param.event_num, param.replace_page_code, param.script_num, param.privacy_num, param.next_url, param.script_num_comp, param.limit_age, param.block_keyword, param.api_num, param.ageYN, param.privacy01checkYN, param.privacy02checkYN, param.page_code]
      const result1 = await this.dbService.executeQueryForShareConnection(connection, query, params);

      let query2 = "delete from boa_content where page_code = ?"
      const param2 = [param.page_code]
      const result2 = await this.dbService.executeQueryForShareConnection(connection, query2, param2);

  

      const query3 = 'insert into boa_content(page_code, content_type, content_name, content_text, content_img_name, content_img_path) values';

      let valueQuery ='' 
      let  params3 = []

      for(let i=0; i<param.insert_db_list.length; i++){

        const temp = param.insert_db_list[i]

        const tempArr = [param.page_code, temp.content_type, temp.content_name, temp.content_text, temp.content_img_name, temp.content_img_path];
        params3 = params3.concat(tempArr);
        valueQuery += '(?, ?, ?, ? ,?, ?)'
        if(i!=param.insert_db_list.length-1)valueQuery += ','

        tempArr.length = 0

      }

      if(param.insert_db_list.length > 0){

        const result3 = await this.dbService.executeQueryForShareConnection(connection, query3+valueQuery, params3);
      }


      return {msg : "등록성공 ::: !", code:"success", path:"/landing/"+param.store_code+"/"+param.page_code}

    })
    return transactionResult
  }

  async getPrivacyList(param): Promise<any[]>{
    const query = "select * from boa_privacy where store_code = ? order by num"
    const params = [param.store_code]
    const result1 = await this.dbService.executeQuery(query, params);
    return result1
  }

  async updatePrivacy(paramArr){

    const transactionResult = await this.dbService.executeTransaction(async (connection) => {
        const query = 'delete from boa_privacy where store_code = ?'
        const params = [paramArr.store_code]
        const result1 = await this.dbService.executeQueryForShareConnection(connection, query, params);

        const query2 = 'insert into boa_privacy(store_code, privacy_name, privacy_content, num) values';

        let valueQuery ='' 
        let  params2 = []

        for(let i=0; i<paramArr.list.length; i++){

          const temp = paramArr.list[i];
          const tempArr = [paramArr.store_code, temp.privacy_name, temp.privacy_content, temp.num];
          params2 = params2.concat(tempArr);
          valueQuery += '(?, ?, ?, ?)'
          if(i!=paramArr.list.length-1)valueQuery += ','

          tempArr.length = 0

        }


        const result2 = await this.dbService.executeQueryForShareConnection(connection, query2+valueQuery, params2);

        return {code:"success", msg:"등록성공"}

    })

    return transactionResult;
  }

  async getEventList(param): Promise<any[]>{
    let query = ''
    if(param.isAddPage_yn == 'y'){
      query = "select * from boa_event where store_code = ? and status='Y' order by num"
    }else{
      query = "select * from boa_event where store_code = ? order by num"
    }
    const params = [param.store_code]
    const result1 = await this.dbService.executeQuery(query, params);
    return result1
  }

  async updateEventList(paramArr){
    const transactionResult = await this.dbService.executeTransaction(async (connection) => {
        const query = 'delete from boa_event where store_code = ?'
        const params = [paramArr.store_code]
        const result1 = await this.dbService.executeQueryForShareConnection(connection, query, params);

        const query2 = 'insert into boa_event(store_code, event_name, memo, status, num) values';

        let valueQuery ='' 
        let  params2 = []

        for(let i=0; i<paramArr.list.length; i++){

          const temp = paramArr.list[i];
          const tempArr = [paramArr.store_code, temp.name, temp.memo,temp.status, temp.num];
          params2 = params2.concat(tempArr);
          valueQuery += '(?, ?, ?, ?, ?)'
          if(i!=paramArr.list.length-1)valueQuery += ','

          tempArr.length = 0

        }


        const result2 = await this.dbService.executeQueryForShareConnection(connection, query2+valueQuery, params2);

        return {code:"success", msg:"등록성공"}

    })

    return transactionResult;
  }

  async getScriptList(param): Promise<any[]>{
    const query = "select * from boa_script where store_code = ? order by num"
    const params = [param.store_code]
    const result1 = await this.dbService.executeQuery(query, params);
    return result1
  }

  async updateScriptList(paramArr){

    const transactionResult = await this.dbService.executeTransaction(async (connection) => {
        const query = 'delete from boa_script where store_code = ?'
        const params = [paramArr.store_code]
        const result1 = await this.dbService.executeQueryForShareConnection(connection, query, params);

        const query2 = 'insert into boa_script(store_code, script_name, script_content, num) values';

        let valueQuery ='' 
        let  params2 = []

        for(let i=0; i<paramArr.list.length; i++){

          const temp = paramArr.list[i];
          const tempArr = [paramArr.store_code, temp.script_name, temp.script_content, temp.num];
          params2 = params2.concat(tempArr);
          valueQuery += '(?, ?, ?, ?)'
          if(i!=paramArr.list.length-1)valueQuery += ','

          tempArr.length = 0

        }


        const result2 = await this.dbService.executeQueryForShareConnection(connection, query2+valueQuery, params2);

        return {code:"success", msg:"등록성공"}

    })

    return transactionResult;
  }

  async getBlockList(param): Promise<any[]>{
    const query = "select * from boa_block_cust where store_code = ? order by num"
    const params = [param.store_code]
    const result1 = await this.dbService.executeQuery(query, params);
    return result1
  }

  async updateBlockList(paramArr){

    const transactionResult = await this.dbService.executeTransaction(async (connection) => {
  
        const query = 'delete from boa_block_cust where store_code = ?'
        const params = [paramArr.store_code]
        const result1 = await this.dbService.executeQueryForShareConnection(connection, query, params);

        const query2 = 'insert into boa_block_cust(store_code, cust_name, cust_phone_number, num, status) values';

        let valueQuery ='' 
        let  params2 = []

        for(let i=0; i<paramArr.list.length; i++){

          const temp = paramArr.list[i];
          const tempArr = [paramArr.store_code, temp.cust_name, temp.cust_phone_number, temp.num, temp.status];
          params2 = params2.concat(tempArr);
          valueQuery += '(?, ?, ?, ?, ?)'
          if(i!=paramArr.list.length-1)valueQuery += ','

          tempArr.length = 0

        }


        const result2 = await this.dbService.executeQueryForShareConnection(connection, query2+valueQuery, params2);

        return {code:"success", msg:"등록성공"}

    })

    return transactionResult;
  }

  async getApiList(param): Promise<any[]>{
    const query = "select * from boa_api where store_code = ? order by num"
    const params = [param.store_code]
    const result1 = await this.dbService.executeQuery(query, params);
    return result1
  }

  async updateApiList(paramArr){

    const transactionResult = await this.dbService.executeTransaction(async (connection) => {
  
        const query = 'delete from boa_api where store_code = ?'
        const params = [paramArr.store_code]
        const result1 = await this.dbService.executeQueryForShareConnection(connection, query, params);

        const query2 = 'insert into boa_api(store_code, api_name, api_url, num, status) values';

        let valueQuery ='' 
        let  params2 = []

        for(let i=0; i<paramArr.list.length; i++){

          const temp = paramArr.list[i];
          const tempArr = [paramArr.store_code, temp.api_name, temp.api_url, temp.num, temp.status];
          params2 = params2.concat(tempArr);
          valueQuery += '(?, ?, ?, ?, ?)'
          if(i!=paramArr.list.length-1)valueQuery += ','

          tempArr.length = 0

        }


        const result2 = await this.dbService.executeQueryForShareConnection(connection, query2+valueQuery, params2);

        return {code:"success", msg:"등록성공"}

    })

    return transactionResult;
  }




  
}