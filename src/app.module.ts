import 'dotenv/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArcjectSecurityModule } from './lib/security/arcjet.module';

@Module({
  imports: [ArcjectSecurityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
