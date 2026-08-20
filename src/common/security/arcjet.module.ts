import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import {
  ArcjetGuard,
  ArcjetModule,
  detectBot,
  shield,
  slidingWindow,
} from '@arcjet/nest';

@Module({
  imports: [
    ArcjetModule.forRoot({
      isGlobal: true,
      key: process.env.ARCJET_KEY!,
      rules: [
        // 1. Bot protected
        detectBot({
          mode: 'LIVE',
          allow: [
            'CATEGORY:SEARCH_ENGINE',
            'CATEGORY:PREVIEW', // Link previews e.g. Slack, Discord
          ],
        }),
        // 2. Shield (SQL Injection, XSS protection)
        shield({ mode: 'LIVE' }),
        // 3. Rate Limiting (e.g., 10 request per minute)
        slidingWindow({ mode: 'LIVE', interval: '60s', max: 10 }),
      ],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ArcjetGuard, // <-- Menjalankan Arcjet di semua endpoint
    },
  ],
})
export class ArcjetSecurityModule {}
