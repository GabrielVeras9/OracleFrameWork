// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@gabrielveras9/oracleforms';
import { LdapAuthModule } from './ldap-auth/ldap-auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule.register(),
    LdapAuthModule,
  ],
})
export class AppModule {}
