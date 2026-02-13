import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BlockService } from './block.service'; 
import { IpBlockMiddleware } from './block.middleware';
import { BlockRepository } from './block.repository';

@Global()
@Module({
  providers: [BlockService, BlockRepository],
  exports: [BlockService],

})
export class BlockModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IpBlockMiddleware) // 사용할 미들웨어 등록
      .forRoutes('*'); // 미들웨어를 적용할 경로나 컨트롤러 지정
  }
}