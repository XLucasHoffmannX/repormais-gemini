import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../modules/user/user.module';
import { CompanyModule } from '../modules/company/company.module';
import { UnityModule } from '../modules/unity/unity.module';
import { ProductModule } from '../modules/product/product.module';
import { WithdrawModule } from '../modules/withdraw/withdraw.module';
import { NoticeModule } from '../modules/notice/notice.module';

/* const isProduction = process.env.NODE_ENV === 'production'; */
const isSSLEnabled = process.env.DB_SSL_ENABLE === 'true';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_DATABASE,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [__dirname + '/../**/*.entity{.js, .ts}'],
      synchronize: true,
      ssl: isSSLEnabled ? { rejectUnauthorized: true } : false,
    }),
    UserModule,
    CompanyModule,
    UnityModule,
    ProductModule,
    WithdrawModule,
    NoticeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
