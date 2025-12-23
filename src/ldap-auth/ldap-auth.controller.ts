import { Body, Controller, Post } from '@nestjs/common';
import { LdapAuthService } from './ldap-auth.service';
import { LdapLoginDto } from './dto/login.dto';

@Controller('ldap')
export class LdapAuthController {
  constructor(private readonly ldapAuth: LdapAuthService) {}

  @Post('login')
  login(@Body() body: LdapLoginDto) {
    return this.ldapAuth.login(body.email, body.password);
  }
}
