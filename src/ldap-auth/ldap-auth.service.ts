import {
  Injectable,
  UnauthorizedException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'ldapts';

@Injectable()
export class LdapAuthService {
  constructor(private readonly config: ConfigService) {}

  private newClient(): Client {
    const url = this.config.get<string>('LDAP_URL');
    if (!url) throw new ServiceUnavailableException('LDAP_URL não configurado');
    return new Client({ url });
  }

  async login(email: string, password: string) {
    if (!email?.trim() || !password) {
      throw new UnauthorizedException('E-mail e senha são obrigatórios');
    }

    const baseDN = this.config.get<string>('LDAP_BASE_DN')!;
    const bindDN = this.config.get<string>('LDAP_BIND_DN')!;
    const bindPass = this.config.get<string>('LDAP_BIND_PASSWORD')!;
    const emailAttr = this.config.get<string>('LDAP_EMAIL_ATTR') ?? 'mail';

    const adminClient = this.newClient();

    try {
      await adminClient.bind(bindDN, bindPass);

      const { searchEntries } = await adminClient.search(baseDN, {
        scope: 'sub',
        filter: `(${emailAttr}=${this.escapeFilter(email.trim())})`,
        attributes: ['dn', 'cn', 'mail', 'uid'],
      });

      if (!searchEntries?.length) {
        throw new UnauthorizedException('Usuário não encontrado no LDAP');
      }

      const entry: any = searchEntries[0];
      const userDN = entry.dn as string;

      const userClient = this.newClient();
      try {
        await userClient.bind(userDN, password);
        return {
          ok: true,
          /*user: {
            dn: userDN,
            cn: entry.cn,
            mail: entry.mail,
            uid: entry.uid,
          },*/
        };
      } catch {
        throw new UnauthorizedException('Senha inválida');
      } finally {
        await userClient.unbind().catch(() => undefined);
      }
    } catch (e: any) {
      if (e?.status === 401) throw e;
      throw new ServiceUnavailableException(
        `Falha ao autenticar via LDAP: ${e?.message ?? e}`,
      );
    } finally {
      await adminClient.unbind().catch(() => undefined);
    }
  }

  private escapeFilter(value: string) {
    return value
      .replace(/\\/g, '\\5c')
      .replace(/\*/g, '\\2a')
      .replace(/\(/g, '\\28')
      .replace(/\)/g, '\\29')
      .replace(/\0/g, '\\00');
  }
}
