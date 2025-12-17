import { IncomingMessage } from 'http';
import http from 'http';
import https from 'https';

export interface SystemUserDTO {
  id: string;
  email: string;
  code?: string;
  [key: string]: any;
}

export default class SystemUserClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  public async getMyIsFirstTime(authHeader?: string): Promise<{ email?: string } | null> {
    const url = `${this.baseUrl}/SystemUser/MyIsFirstTime`;
    const json = await this.getJson(url, authHeader);
    return json as any;
  }

  public async getByEmail(email: string, authHeader?: string): Promise<SystemUserDTO | null> {
    const url = `${this.baseUrl}/SystemUser/ByEmail/${encodeURIComponent(email)}`;
    const json = await this.getJson(url, authHeader);
    return json as SystemUserDTO | null;
  }

  private async getJson(urlStr: string, authHeader?: string): Promise<any> {
    const urlObj = new URL(urlStr);
    const isHttps = urlObj.protocol === 'https:';
    const lib = isHttps ? https : http;

    const options: https.RequestOptions = {
      method: 'GET',
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + (urlObj.search || ''),
      headers: {
        'Accept': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {})
      }
    };

    return new Promise((resolve, reject) => {
      const req = lib.request(options, (res: IncomingMessage) => {
        const { statusCode } = res;
        let data = '';
        res.setEncoding('utf8');
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          if (statusCode && statusCode >= 200 && statusCode < 300) {
            try {
              resolve(data ? JSON.parse(data) : null);
            } catch (err) {
              reject(err);
            }
          } else if (statusCode === 404) {
            resolve(null);
          } else if (statusCode === 401 || statusCode === 403) {
            reject(new Error('Unauthorized when contacting SystemUser API'));
          } else {
            reject(new Error(`SystemUser API error: ${statusCode} ${data}`));
          }
        });
      });
      req.on('error', reject);
      req.end();
    });
  }
}
