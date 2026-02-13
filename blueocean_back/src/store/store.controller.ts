import { Body, Controller, Get, Post, Query, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { StoreService } from './store.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AccessAuthGuard } from 'src/auth/passport_access_guard.jwt';
import { RolesGuard } from 'src/auth/role.gaurd';
import { Roles } from 'src/auth/role.decorator';

@Controller('boa-s')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get("/dashboard/list")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async dashboard(@Query() query, @Req() req){

    const result = await this.storeService.getStoreDBListService(query)

    return result
  
  }

  @Get("/db/list")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async dbList(@Query() query, @Req() req){

    const result = await this.storeService.getStoreDBListService(query)

    return result
  
  }

  @Get("/db/list/detail")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async dbListDetail(@Query() query, @Req() req){

    const result = await this.storeService.getStoreDBDetailService(query)

    return result
  
  }

  @Post("/db/list/detail/update")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async dbListDetailUpdate(@Body() body, @Req() req){

    const result = await this.storeService.updateStoreDBDetailService(body)

    return result
  
  }


  @Get("/db/round/list")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async dbRound(@Query() query, @Req() req){

    const result = await this.storeService.getDBRoundListService(query)

    return result
  
  }

  @Post("/db/round/update")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async dbRoundUpdate(@Body() body, @Req() req){

    const result = await this.storeService.updateDBRoundServcie(body)

    return result
  
  }

  @Get("/db/round/info")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async dbRoundInfo(@Query() query, @Req() req){

    const result = await this.storeService.getDBRoundInfoListService(query)

    return result
  
  }

  @Get("/db/manage/list")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async dbManageList(@Query() query, @Req() req){

    const result = await this.storeService.getDBManageListService(query)

    return result
  
  }

  @Post("/db/manage/round")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async updateRegInfoRound(@Body() body, @Req() req){

    const result = await this.storeService.updateRegInfoRoundService(body)

    return result
  
  }
  @Get("/db/manage/status")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async getStatusCountList(@Query() query, @Req() req){

    const result = await this.storeService.getStatusCountListService(query)

    return result
  
  }

  @Post("/db/manage/status/update")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async updateStatus(@Body() body, @Req() req){

    const result = await this.storeService.updateStatusService(body)

    return result
  
  }

  @Post("/db/manage/add")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async addDBRegInfoData(@Body() body, @Req() req){

    const result = await this.storeService.addDBRegInfoDataService(body)

    return result
  
  }

  
  @Get("/db/manage/delivery/list")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async deliveryList(@Query() query, @Req() req){

    const result = await this.storeService.deliveryListService(query)

    return result
  
  }

  @Get("/ad/page/list")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async pageList(@Query() query, @Req() req){

    const result = await this.storeService.getPageListService(query)

    return result
  
  }

  @Post("/db/manage/delivery/update")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async updateDelivery(@Body() body, @Req() req){

    const result = await this.storeService.updateDeliveryService(body)

    return result
  
  }

  @Get("/dashboard/chart/data")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async dashboard1(@Query() query, @Req() req){

    const result = await this.storeService.getDashBoardChartData(query)

    return result
  
  }

  @Get("/dashboard/info/data")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async dashboard2(@Query() query, @Req() req){

    const result = await this.storeService.getDashBoardInfoDataService(query)

    return result
  
  }

  @Get("/ad/stats/list")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async statsList(@Query() query, @Req() req){

    const result = await this.storeService.getPageStatsListService(query)

    return result
  
  }

  @Get("/ad/manage/list")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async adpagelist(@Query() query, @Req() req){

    const result = await this.storeService.getAdPageListService(query)

    return result
  
  }
  @Post("/ad/manage/add")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  @UseInterceptors(FilesInterceptor('files'))
  async adAddt(@Body() body, @UploadedFiles()files, @Req() req){

    const result = await this.storeService.addAdService(body, files)

    return result
  
  }

  @Get("/ad/manage/detail")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async pageDetail(@Query() query, @Req() req){

    const result = await this.storeService.getPageDetailService(query)

    return result
  
  }

  
  @Post("/ad/manage/detail/update")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  @UseInterceptors(FilesInterceptor('files'))
  async updateadd(@Body() body, @UploadedFiles()files, @Req() req){

    const result = await this.storeService.updateAdService(body, files)

    return result
  
  }

  @Get("/etc/privacy/list")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async privacyList(@Query() query, @Req() req){

    const result = await this.storeService.getPrivacyListService(query)

    return result
  
  }

  @Post("/etc/privacy/update")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async updatePravacy(@Body() body, @Req() req){

    const result = await this.storeService.updatePrivacyService(body)

    return result
  
  }

  @Get("/etc/event/list")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async eventList(@Query() query, @Req() req){

    const result = await this.storeService.getEventListService(query)

    return result
  
  }

  @Post("/etc/event/update")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async updateEvent(@Body() body, @Req() req){

    const result = await this.storeService.updateEventListService(body)

    return result
  
  }

  @Get("/etc/script/list")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async scriptList(@Query() query, @Req() req){

    const result = await this.storeService.getScriptListService(query)

    return result
  
  }

  @Post("/etc/script/update")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async updatescript(@Body() body, @Req() req){

    const result = await this.storeService.updateScriptListService(body)

    return result
  
  }

  @Get("/etc/block/list")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async blockList(@Query() query, @Req() req){

    const result = await this.storeService.getBlockListService(query)

    return result
  
  }

  @Post("/etc/block/update")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async updateBlockList(@Body() body, @Req() req){

    const result = await this.storeService.updateBlockListService(body)

    return result
  
  }

  @Get("/etc/api/list")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async apiList(@Query() query, @Req() req){

    const result = await this.storeService.getApiListService(query)

    return result
  
  }

  @Post("/etc/api/update")
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles('client', 'admin')
  async updateApiList(@Body() body, @Req() req){

    const result = await this.storeService.updateApiListService(body)

    return result
  
  }



  
  


}
