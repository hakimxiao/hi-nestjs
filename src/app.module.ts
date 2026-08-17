import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArcjectSecurityModule } from './lib/security/arcjet.module';
import { PrismaModule } from './lib/database/prisma.module';

@Module({
  imports: [ArcjectSecurityModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
