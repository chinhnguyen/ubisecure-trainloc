import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { LoggingMiddleware } from 'src/middlewares/LoggingMiddleware'
import { UsersModule } from 'src/modules/users/users.module'

@Module({
  imports: [UsersModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*')
  }
}
