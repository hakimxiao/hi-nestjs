import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArcjectSecurityModule } from './lib/security/arcjet.module';
import { PrismaModule } from './lib/database/prisma.module';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth';
import { UserModule } from './module/user/user.module';

@Module({
  imports: [
    ArcjectSecurityModule,
    PrismaModule,
    AuthModule.forRoot({ auth, disableGlobalAuthGuard: true }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
