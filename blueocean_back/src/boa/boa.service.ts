import { Injectable } from '@nestjs/common';
import { BoaRepository } from './boa.repository';
import { PagingDto } from 'src/common/paging/paging.dto';
import { CodeUtilService } from 'src/common/util/codeUtil.service';

@Injectable()
export class BoaService {

    constructor(private readonly boaRepostory : BoaRepository, private readonly codeUtilService : CodeUtilService) {}

    async getMenuListService(param): Promise<any>{
        const rows = await this.boaRepostory.getMenuList(param)
        return rows
    }

    async getMenuAllListService(param): Promise<any>{
        const rows = await this.boaRepostory.getMenuListAll(param)
        return rows
    }

    async getDashBoardListService(param): Promise<any>{
        const rows = await this.boaRepostory.getDashBoardList(param)
        return rows
    }

    async getClientStoreListService(param): Promise<any>{
        const [pageingDto, result] = await this.boaRepostory.getClientStoreList(param)
        //console.log(pageingDto)
        return {paging : pageingDto , storeList : result}
    }

    async updateClientStoreStatusService(param): Promise<any>{
        const rows = await this.boaRepostory.updateClientStoreStatus(param)
        //console.log(pageingDto)
        return rows
    }

    async getStoreDetailService(param): Promise<any>{
        const rows = await this.boaRepostory.getStoreDetail(param)
        const newResult:Record<string,any> = {}
        rows.forEach((element, index) => {
            if(index == 0){
                newResult.store_code = element.store_code;
                newResult.store_name = element.store_name;
                newResult.status = element.status;
                newResult.client_type_id = element.client_type_id;
                newResult.client_type_name = element.client_type_name;
                newResult.admin_login_id = element.admin_login_id;
                newResult.admin_name = element.admin_name;
                newResult.register_time = element.register_time;
                newResult.send_phone_number = element.send_phone_number;

                newResult.conn_user_list = []
            }

            const conn_user = {conn_user_id : element.conn_user_id, conn_user_name : element.conn_user_name}

            if(conn_user.conn_user_id){
                newResult.conn_user_list.push(conn_user)
            }
            
            

        });
        
        return newResult
    }

    async updateStoreDetailService(param): Promise<any>{
        const rows = await this.boaRepostory.updateStoreDetail(param)
        return rows
    }

    async addClientStoreService(param): Promise<any>{

        const store_code = this.codeUtilService.createCode_8()
        param.store_code = store_code

        const rows = await this.boaRepostory.addClientStore(param)
        return rows
    }

    async searchUserService(param): Promise<any>{
        const rows = await this.boaRepostory.searchUser(param)
        return rows
    }

    
    async getClientTypeListService(param): Promise<any>{
        const rows = await this.boaRepostory.getClientTypeList(param)
        return rows
    }

    async updateClientTypeUpdateService(param): Promise<any>{
        const rows = await this.boaRepostory.updateClientType(param)
        return rows
    }

    async getRoleTypeListService(param): Promise<any>{
        const rows = await this.boaRepostory.getRoleTypeList(param)
        return rows
    }

    async addRoleService(param): Promise<any>{
        const rows = await this.boaRepostory.addRole(param)
        return rows
    }

    async getRoleDetailService(param): Promise<any>{
        const rows = await this.boaRepostory.getRoleDetail(param)
        const newResult:Record<string,any> = {}
        rows.forEach((element, index) => {
            if(index == 0){
                newResult.role_name = element.role_name;
                newResult.role_id = element.role_id;
                newResult.memo = element.memo;
                newResult.role_type = element.role_type;
                newResult.status = element.status;

                newResult.conn_menu_list = []
            }

            const conn_menu = {menu_id : element.menu_id, menu_name : element.menu_name, menu_type : element.menu_type}

            newResult.conn_menu_list.push(conn_menu)
            

        });
        return newResult
    }

    async updateRoleTypeUpdateService(param): Promise<any>{
        const rows = await this.boaRepostory.updateRoleType(param)
        return rows
    }

    
    async getMediaListService(param): Promise<any>{
        const rows = await this.boaRepostory.getMediaList(param)
        return rows
    }

    async mediaUpdateService(param): Promise<any>{
        const rows = await this.boaRepostory.updateMedia(param)
        return rows
    }

    async getAccountListService(param): Promise<any>{
        const [pageingDto, result] = await this.boaRepostory.getAccountList(param)
        return {paging : pageingDto , dataList : result}

    }

    
    async getAccountDetailService(param): Promise<any>{
        const rows = await this.boaRepostory.getAccountDetail(param)
        const newResult:Record<string,any> = {}
        rows.forEach((element, index) => {
            if(index == 0){
                newResult.user_id = element.user_id;
                newResult.user_name = element.user_name;
                newResult.user_login_id = element.user_login_id;
                newResult.status = element.status;
                newResult.role_name = element.role_name;
                newResult.role_id = element.role_id;


                newResult.conn_store_list = []
            }

            const conn_store = {store_code : element.store_code, store_name : element.store_name}

            newResult.conn_store_list.push(conn_store)
            

        });
        
        return newResult

    }

    async searchStoreService(param): Promise<any>{
        const rows = await this.boaRepostory.searchStore(param)
        return rows
    }

    async updateAccountDetailService(param): Promise<any>{
        const rows = await this.boaRepostory.updateAccountDetail(param)
        return rows
    }

    async addAccountService(body): Promise<any>{
        const rows = await this.boaRepostory.addACcount(body)
        return rows
    }

    async getBoaPageListService(): Promise<any> {
        const rows = await this.boaRepostory.getBoaPageList()
        return rows
    }




    
}
