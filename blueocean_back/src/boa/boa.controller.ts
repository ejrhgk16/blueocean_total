import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { BoaService } from './boa.service';
import { AccessAuthGuard } from 'src/auth/passport_access_guard.jwt';
import { RolesGuard } from 'src/auth/role.gaurd';
import { Roles } from 'src/auth/role.decorator';
import { BlockService } from 'src/common/block/block.service';

@Controller('boa')
export class BoaController {
  constructor(private readonly boaService: BoaService, private readonly blockService: BlockService) {}

  @Get("/menu")
  @UseGuards(AccessAuthGuard, RolesGuard)
  async toeknTest(@Query() query, @Res({passthrough : true}) res : Response, @Req() req){

    //const param = {role_name : 'master'}
    const result = await this.boaService.getMenuListService(req.user)

    return result
  
  }

  @Get("/menu/all")
  // @UseGuards(AccessAuthGuard, RolesGuard)
  async menuAll(@Query() query, @Res({passthrough : true}) res : Response, @Req() req){

    //const param = {role_name : 'master'}
    const result = await this.boaService.getMenuAllListService(req.user)

    return result
  
  }

  @Get("/dashboard/list")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('admin')
  async dashboard(@Query() query, @Res({passthrough : true}) res : Response, @Req() req){

    //const param = {role_name : 'master'}
    const result = await this.boaService.getDashBoardListService(req.user)

    return result
  
  }

  @Get("/client/store/list")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('admin')
  async cilentStore(@Query() query, @Res({passthrough : true}) res : Response, @Req() req){

    //const param = {role_name : 'master'}
    const result = await this.boaService.getClientStoreListService(query)

    return result

  }

  @Post("/client/store/status/update")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('admin')
  async clientStatus(@Body() body, @Res({passthrough : true}) res : Response, @Req() req){

    //const param = {role_name : 'master'}
    const result = await this.boaService.updateClientStoreStatusService(body)

    return result

  }

  @Post("/client/store/add")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('admin')
  async cilentStoreUpdate(@Body() body, @Res({passthrough : true}) res : Response, @Req() req){

    //const param = {role_name : 'master'}
    const result = await this.boaService.addClientStoreService(body)

    return result
   
  }

  @Get("/client/store/detail")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('admin')
  async storeDetail(@Query() query, @Res({passthrough : true}) res : Response, @Req() req){

    //const param = {role_name : 'master'}
    const result = await this.boaService.getStoreDetailService(query)

    return result

  }

  
  @Post("/client/store/detail/update")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('admin')
  async updateStoreDetail(@Body() body, @Res({passthrough : true}) res : Response, @Req() req){

    //const param = {role_name : 'master'}
    const result = await this.boaService.updateStoreDetailService(body)

    return result

  }


  @Get("/search/user")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('admin')
  async searchUser(@Query() query, @Res({passthrough : true}) res : Response, @Req() req){

    //const param = {role_name : 'master'}
    const result = await this.boaService.searchUserService(query)

    return result

  }




  @Get("/client/type/list")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('admin')
  async cilentType(@Query() query, @Res({passthrough : true}) res : Response, @Req() req){

    //const param = {role_name : 'master'}
    const result = await this.boaService.getClientTypeListService(req.user)

    return result

  }

  @Post("/client/type/update")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('admin')
  async cilentTypeUpdate(@Body() body, @Res({passthrough : true}) res : Response, @Req() req){

    //const param = {role_name : 'master'}
    const result = await this.boaService.updateClientTypeUpdateService(body)

    return result
   
  }

  @Get("/etc/role/list")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('admin')
  async roleType(@Query() query, @Res({passthrough : true}) res : Response, @Req() req){

    //const param = {role_name : 'master'}
    const result = await this.boaService.getRoleTypeListService(query)

    return result

  }

  @Get("/etc/role/detail")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('admin')
  async roleDetail(@Query() query, @Res({passthrough : true}) res : Response, @Req() req){

    //const param = {role_name : 'master'}
    const result = await this.boaService.getRoleDetailService(query)

    return result

  }


  @Post("/etc/role/add")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('admin')
  async addRole(@Body() body, @Res({passthrough : true}) res : Response, @Req() req){

    //const param = {role_name : 'master'}
    const result = await this.boaService.addRoleService(body)

    return result
   
  }


  @Post("/etc/role/update")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('admin')
  async roleTypeUpdate(@Body() body, @Res({passthrough : true}) res : Response, @Req() req){

    //const param = {role_name : 'master'}
    const result = await this.boaService.updateRoleTypeUpdateService(body)

    return result
   
  }


  @Get("/etc/media/list")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('admin', 'client')
  async mediaList(@Query() query, @Res({passthrough : true}) res : Response, @Req() req){

    //const param = {role_name : 'master'}
    const result = await this.boaService.getMediaListService(req.user)

    return result

  }

  @Post("/etc/media/update")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('admin')
  async mediaUpdate(@Body() body, @Res({passthrough : true}) res : Response, @Req() req){

    //const param = {role_name : 'master'}
    const result = await this.boaService.mediaUpdateService(body)

    return result
   
  }


  @Get("/etc/access/list")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('admin')
  async accessList(@Query() query, @Res({passthrough : true}) res : Response, @Req() req){

    //const param = {role_name : 'master'}
    const result = await this.blockService.getBlockListService(req.user)

    return result

  }

  @Post("/etc/access/update")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('admin')
  async accessUpdate(@Body() body, @Res({passthrough : true}) res : Response, @Req() req){

    //const param = {role_name : 'master'}
    const result = await this.blockService.updateBlockListService(body)

    return result
   
  }

  @Get("/account/list")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('admin')
  async accountList(@Query() query, @Res({passthrough : true}) res : Response, @Req() req){

    //const param = {role_name : 'master'}
    const result = await this.boaService.getAccountListService(query)

    return result

  }

  @Get("/account/detail")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('admin')
  async accountDetail(@Query() query, @Res({passthrough : true}) res : Response, @Req() req){

    //const param = {role_name : 'master'}
    const result = await this.boaService.getAccountDetailService(query)

    return result

  }

  @Get("/search/store")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('admin')
  async searchStore(@Query() query, @Res({passthrough : true}) res : Response, @Req() req){

    //const param = {role_name : 'master'}
    const result = await this.boaService.searchStoreService(query)

    return result

  }

  @Post("/account/detail/update")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('admin')
  async updateAccountDetail(@Body() body, @Res({passthrough : true}) res : Response, @Req() req){

    //const param = {role_name : 'master'}
    const result = await this.boaService.updateAccountDetailService(body)

    return result

  }

  
  @Post("/account/detail/add")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('admin')
  async addAccountDetail(@Body() body, @Res({passthrough : true}) res : Response, @Req() req){

    //const param = {role_name : 'master'}
    const result = await this.boaService.addAccountService(body)

    return result//

  }

  @Get("/page/list")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('admin')
  async pageList(@Query() query, @Res({passthrough : true}) res : Response, @Req() req){

    const result = await this.boaService.getBoaPageListService()

    return result//

  }






}
