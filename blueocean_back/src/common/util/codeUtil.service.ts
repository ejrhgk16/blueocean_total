import { Inject, Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class CodeUtilService {

  constructor() {}
  
  createCode_8(): string{
    return uuidV4().split('-')[0]; // UUID의 첫 번째 부분을 사용 (8자리)
  }

}
