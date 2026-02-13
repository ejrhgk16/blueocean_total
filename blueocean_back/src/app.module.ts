import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestModule } from './test/test.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DBModule } from './common/db/db.module';
import { BoaModule } from './boa/boa.module';
import { BlockModule } from './common/block/blcok.module';
import { CacheModule } from '@nestjs/cache-manager';
import { IpBlockMiddleware } from './common/block/block.middleware';
import { UtilModule } from './common/util/util.module';
import { StoreModule } from './store/store.module';
import { LandingModule } from './landing/landing.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `src/config/.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    CacheModule.register({ isGlobal: true }),
    
    BlockModule, AuthModule, DBModule, BoaModule, UtilModule, StoreModule, LandingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

}
