import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { LandingService } from './landing.service';

@Controller('landing')
export class LandingController {
  constructor(private readonly landingService: LandingService) {
  }

  
  @Get("/content/list")
  // @UseGuards(AccessAuthGuard, RolesGuard)
  async content(@Query() query, @Req() req){

    console.log("content/list")
    const result = await this.landingService.getContentListService(query)
    console.log("content/list2")


    return result
  
  }

  @Get("/comp/script")
  // @UseGuards(AccessAuthGuard, RolesGuard)
  async script(@Query() query, @Req() req){

    const result = await this.landingService.getCompScriptService(query)


    return result
  
  }

  @Get("/privacy")
  // @UseGuards(AccessAuthGuard, RolesGuard)
  async privacy(@Query() query, @Req() req){

    const result = await this.landingService.getPrivcayServcie(query)

    return result
  
  }

  @Post("/reginfo/add")
  // @UseGuards(AccessAuthGuard, RolesGuard)
  async add(@Body() body, @Req() req){

    const result = await this.landingService.addRegInfoServcie(body, req)

    return result
  
  }

  @Get("/count")
  // @UseGuards(AccessAuthGuard, RolesGuard)
  async count(@Query() query, @Req() req){

    const result = await this.landingService.updateCountService(query)

    return result
  
  }

  @Get("/reginfo/add")//zapier용 등록
  async add_(@Query() query, @Req() req){

    const result = await this.landingService.updateCountService(query)

    return result
  
  }

}
