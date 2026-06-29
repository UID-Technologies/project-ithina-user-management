import helmet from 'helmet';
import { env } from './env.config';

const isHttpsPublicUrl = env.API_PUBLIC_URL.startsWith('https://');

/**
 * Helmet 8 enables CSP `upgrade-insecure-requests` by default, which rewrites
 * asset URLs to HTTPS. On a plain-HTTP VM deploy that breaks Swagger UI
 * (ERR_SSL_PROTOCOL_ERROR) because nothing listens on TLS.
 */
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      upgradeInsecureRequests: isHttpsPublicUrl ? [] : null,
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  crossOriginOpenerPolicy: isHttpsPublicUrl ? undefined : false,
  originAgentCluster: isHttpsPublicUrl ? undefined : false,
  strictTransportSecurity: isHttpsPublicUrl ? undefined : false,
});
