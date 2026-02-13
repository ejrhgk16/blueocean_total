import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TestService } from './test.service';
import { query } from 'express';

@Controller('test')
export class TestController {
    constructor(private readonly testService: TestService) {}

    @Get("/test")
    getHello(): string {
      return "test2";
    }

    @Get("/test/findAll")
    async getFindAll(@Query() query): Promise<any[]>{


        let result = this.testService.getAll();

        return result;
    }

    @Post("/test/findAll")
    async getFindAll2(@Body() body): Promise<any[]>{

        let result = this.testService.getAll();
        return result;
    }

    @Get("/test/empty")
    async getEmpty() : Promise<any[]>{
        let result = this.testService.getEmpty();
        return result;
    }
}

