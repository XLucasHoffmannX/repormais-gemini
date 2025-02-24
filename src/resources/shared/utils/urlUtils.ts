import { Request } from 'express';

export class UrlUtils {
  static buildBaseUrl(req: Request): string {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return baseUrl;
  }

  static buildFullUrlString(req: Request): string {
    const baseUrl = this.buildBaseUrl(req);
    const path = req.originalUrl.split('?')[0];
    return `${baseUrl}${path}`;
  }
}
