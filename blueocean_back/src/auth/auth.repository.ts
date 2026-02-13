import { Injectable } from "@nestjs/common";
import { DbService } from "src/common/db/db.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthRepository {
    constructor(
       private readonly dbService : DbService
    ){}

    async findUserByIdPassword(body): Promise<any[]>{

        const resultMultiQuery = this.dbService.executeMultiQuery(async(connection)=>{

            const query = 'select user_login_id, user_password, user_name, role_name, role_type from boa_user join boa_role on boa_user.role_id = boa_role.role_id where boa_user.status = "Y" and user_login_id = ?  ';
            const params = [body.user_login_id];
    
            const result1 = await this.dbService.executeQueryForShareConnection(connection, query, params)
            // console.log(result1[0])

            if(result1.length <= 0){
                return [null, null]
            }

            const isMatch = bcrypt.compareSync(body.user_password, result1[0].user_password)

            if(result1 && isMatch && result1.length > 0){
              
            
                    
                const query2 = "select user_login_id, store_code, store_name from (select * from boa_user_store where user_login_id = ?)bu left join boa_user using(user_login_id) left join boa_store bs using(store_code)"
                const params2 = [body.user_login_id];
                const result2 = await this.dbService.executeQueryForShareConnection(connection, query2, params2)

                return [result1, result2]
        
            }else{
                return [null, null]

            }

    
          })
    
          return resultMultiQuery;
    
        }


    async isnertRefreshToken(body, token): Promise<any[]>{

        const query = 'insert into boa_auth(user_login_id, auth_refresh_token) values(?, ?)';
        const params = [body.user_login_id, token]

        return this.dbService.executeQuery(query, params);
    }

    async getUserStoreList(user_login_id):Promise<any[]>{

        const query = 'select * from boa_user_store where user_login_id = ?';
        const params = [user_login_id]
        return this.dbService.executeQuery(query, params);

    }

    async getUserInfoAndRefreshToken(param){
        const query = 'select bubr.user_login_id, role_name, role_type, auth_refresh_token from (select user_login_id,boa_role.role_name , boa_role.role_type from boa_user join boa_role on boa_user.role_id = boa_role.role_id where user_login_id = ?) bubr join boa_auth au on bubr.user_login_id = au.user_login_id where auth_refresh_token = ?';
        const params = [param.user_login_id, param.refresh_token]
        
        return this.dbService.executeQuery(query, params);
    }

    async deleteToken(param){
        const query = 'delete from boa_auth where auth_refresh_token = ?'
        const params = [param.auth_refresh_token]
        const result1 = await this.dbService.executeQuery(query, params);
        return {msg : "logout token delte !! "}
    }

    async deleteTokenAndinsertToeknIntransaction(param){

        const transactionResult = await this.dbService.executeTransaction(async (connection) => {
            // console.log("deleteTokenAndinsertToeknIntransaction", param)
            const query = 'delete from boa_auth where user_login_id = ?'
            const params = [param.user_login_id]
            const result1 = await this.dbService.executeQuery(query, params);

            const query2 = 'insert into boa_auth(user_login_id, auth_refresh_token) values(?, ?)';
            const params2 = [param.user_login_id, param.refresh_token]
            const result2 = await this.dbService.executeQuery(query2, params2);

        })

        return transactionResult;
    }

    async getMenuList(param): Promise<any[]>{
 
        const query = "select boa_menu.menu_id,boa_menu.menu_name,boa_menu.menu_path, boa_menu.menu_depth, boa_menu.menu_type, boa_menu.parent_menu_id from boa_role_menu join boa_menu on boa_role_menu.menu_id  = boa_menu.menu_id where role_name=?"
        const params = [param.role_name];

        return this.dbService.executeQuery(query, params);

    }



}