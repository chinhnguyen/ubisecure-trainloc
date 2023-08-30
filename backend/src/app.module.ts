import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LoggingMiddleware } from 'src/middlewares/LoggingMiddleware'
import { TrainsModule } from 'src/modules/trains/trains.module'
import { UsersModule } from 'src/modules/users/users.module'

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, TrainsModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*')
  }
}
