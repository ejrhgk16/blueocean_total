import { Inject, Injectable } from '@nestjs/common';
import { TestRepository } from './test.repository';
import { TestDto } from './dto/testDto';


@Injectable()
export class TestService {

    constructor(private readonly testRepository : TestRepository) {}

    async getAll():Promise<TestDto[]>{

        let rows = await this.testRepository.findAll()
        let result = rows.map((row)=>{
            let testDto : TestDto = new TestDto(row.test_id, row.test_name)
            return testDto
        })

        return result

    }

    async getEmpty():Promise<TestDto[]>{

        let rows = await this.testRepository.getEmpty()
        let result = rows.map((row)=>{
            let testDto : TestDto = new TestDto(row.test_id, row.test_name)
            return testDto
        })

        return result
    }

    

}
