import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RacketsController } from './rackets.controller';
import { RacketsService } from './rackets.service';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { LoggingMiddleware } from './logging.middleware'; 

@Module({
  imports: [
    ConfigModule.forRoot({//1
      isGlobal: true,
    }),
    AuthModule,//2
  ],
  controllers: [AppController, RacketsController],//3
  providers: [AppService, RacketsService, PrismaService],//4
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware) 
      .forRoutes('*'); 
                      
  }
}