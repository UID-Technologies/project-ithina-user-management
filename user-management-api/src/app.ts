import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { corsConfig } from './config/cors.config';
import { swaggerSpec } from './config/swagger.config';
import { correlationIdMiddleware } from './common/middlewares/correlation-id.middleware';
import {
  errorMiddleware,
  notFoundMiddleware,
  requestLoggerMiddleware,
} from './common/middlewares/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import tenantRoutes from './modules/tenants/tenants.routes';
import organizationRoutes from './modules/organizations/organizations.routes';
import userRoutes from './modules/users/users.routes';
import roleRoutes from './modules/roles/roles.routes';
import permissionRoutes from './modules/permissions/permissions.routes';
import moduleAccessRoutes from './modules/module-access/module-access.routes';
import approvalRoutes from './modules/approvals/approvals.routes';
import guardrailRoutes from './modules/guardrails/guardrails.routes';
import auditRoutes from './modules/audit/audit.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import searchRoutes from './modules/dashboard/search.routes';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors(corsConfig));
  app.use(express.json());
  app.use(correlationIdMiddleware);
  app.use(requestLoggerMiddleware);

  app.get('/health', (_req, res) => {
    res.json({ success: true, message: 'OK', data: { status: 'healthy' } });
  });

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api/docs.json', (_req, res) => res.json(swaggerSpec));

  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/superadmin/tenants', tenantRoutes);
  app.use('/api/v1/superadmin/organizations', organizationRoutes);
  app.use('/api/v1/superadmin/users', userRoutes);
  app.use('/api/v1/superadmin/roles', roleRoutes);
  app.use('/api/v1/superadmin/permissions', permissionRoutes);
  app.use('/api/v1/superadmin/module-access', moduleAccessRoutes);
  app.use('/api/v1/superadmin/approvals', approvalRoutes);
  app.use('/api/v1/superadmin/guardrails', guardrailRoutes);
  app.use('/api/v1/superadmin/audit', auditRoutes);
  app.use('/api/v1/superadmin/dashboard', dashboardRoutes);
  app.use('/api/v1/superadmin/search', searchRoutes);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
