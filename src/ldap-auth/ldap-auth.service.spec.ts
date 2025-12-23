import { Test, TestingModule } from '@nestjs/testing';
import { LdapAuthService } from './ldap-auth.service';

describe('LdapAuthService', () => {
  let service: LdapAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LdapAuthService],
    }).compile();

    service = module.get<LdapAuthService>(LdapAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
