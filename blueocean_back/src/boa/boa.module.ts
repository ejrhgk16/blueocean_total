import { Module } from '@nestjs/common';
import { BoaService } from './boa.service';
import { BoaController } from './boa.controller';
import { BoaRepository } from './boa.repository';
import { BlockService } from 'src/common/block/block.service';
import { BlockRepository } from 'src/common/block/block.repository';

@Module({
  controllers: [BoaController],
  providers: [BoaService, BoaRepository],
})
export class BoaModule {}
