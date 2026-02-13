import { Module } from '@nestjs/common';
import { LandingService } from './landing.service';
import { LandingController } from './landing.controller';
import { LandingRepository } from './landing.repository';

@Module({
  controllers: [LandingController],
  providers: [LandingService, LandingRepository],
})
export class LandingModule {}
