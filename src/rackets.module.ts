
import { Module } from '@nestjs/common';
import { RacketsController } from './rackets.controller';
import { RacketsService } from './rackets.service';

@Module({
  imports: [],
  controllers: [RacketsController],
  providers: [RacketsService],
  exports: [RacketsService],
})
export class RacketsModule {}