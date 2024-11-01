import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { UsersModule } from './users/users.module';
import { CurrentUserMiddleware } from './utility/common/middlewares/current-user.middleware';
import { BusinessModule } from './business/business.module';
@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), UsersModule, UsersModule, BusinessModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes({path: "*", method: RequestMethod.ALL});
  }
}
