import { Test, TestingModule } from '@nestjs/testing';
import { LdapAuthController } from './ldap-auth.controller';

describe('LdapAuthController', () => {
  let controller: LdapAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LdapAuthController],
    }).compile();

    controller = module.get<LdapAuthController>(LdapAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
