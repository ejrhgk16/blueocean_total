import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CodeUtilService } from './codeUtil.service';
import { FileUtilService } from './fileUtil.service';
import { MessageUtilService } from './messageUtil.service';
import { HttpModule } from '@nestjs/axios';



@Global()
@Module({
  imports : [HttpModule],
  providers: [CodeUtilService, FileUtilService, MessageUtilService],
  exports: [CodeUtilService, FileUtilService, MessageUtilService],

})
export class UtilModule{}