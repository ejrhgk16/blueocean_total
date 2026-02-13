import { Injectable, Inject } from '@nestjs/common';
import { TestDto } from './dto/testDto';
import { DbService } from 'src/common/db/db.service';

@Injectable()
export class TestRepository {
    constructor(
       private readonly dbService : DbService
    ){}

    async findAll(): Promise<any[]>{
        const query = 'select test_id, test_name from test_table'
        const param = []

        return this.dbService.executeQuery(query, param);

    }

    
    async getEmpty(): Promise<any[]>{
        const query = 'select test_id, test_name from test_table where test_id = 111'
        const param = []

        return this.dbService.executeQuery(query, param);

    }

}