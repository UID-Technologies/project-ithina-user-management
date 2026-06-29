import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { createApp } from '../../src/app';
import { AuthAccountModel } from '../../src/modules/auth/auth.model';
import { UserModel } from '../../src/modules/users/users.model';
import { RoleModel } from '../../src/modules/roles/roles.model';
import { PermissionModel } from '../../src/modules/permissions/permissions.model';
import { TenantModel } from '../../src/modules/tenants/tenants.model';
import { PlatformMetricsModel } from '../../src/modules/dashboard/dashboard.model';

describe('User Management API', () => {
  let mongo: MongoMemoryServer;
  let app: ReturnType<typeof createApp>;
  let token: string;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
    app = createApp();

    await PermissionModel.create({
      externalId: 'p13',
      module: 'admin',
      resource: 'Audit Log',
      action: 'VIEW',
      scope: 'Global',
    });

    await RoleModel.create({
      externalId: 'r-super',
      name: 'Super Admin',
      type: 'Platform',
      description: 'Full access',
      isCustom: false,
      usersCount: 1,
      permissionIds: ['p13'],
      inheritsFrom: [],
    });

    await UserModel.create({
      externalId: 'u-1',
      name: 'Anjali Mehta',
      email: 'anjali@ithina.ai',
      tenantId: 'platform',
      roleIds: ['r-super'],
      locationIds: [],
      status: 'active',
      lastActive: 'now',
      mfaEnabled: true,
    });

    const passwordHash = await bcrypt.hash('SuperAdmin123!', 12);
    await AuthAccountModel.create({
      externalId: 'auth-u-1',
      email: 'anjali@ithina.ai',
      passwordHash,
      userId: 'u-1',
    });

    await TenantModel.insertMany([
      {
        externalId: 't-zabka',
        name: 'Żabka Group',
        tier: 'Enterprise',
        industry: 'Convenience',
        country: 'Poland',
        storesCount: 9842,
        usersCount: 1240,
        status: 'active',
        modules: ['roos', 'admin'],
        primaryContact: 'Anna Kowalski',
        contactEmail: 'a.kowalski@zabka.pl',
        monthlyRevenue: 142000,
      },
      {
        externalId: 't-bucees',
        name: "Buc-ee's",
        tier: 'Enterprise',
        industry: 'Convenience / Fuel',
        country: 'USA',
        storesCount: 47,
        usersCount: 312,
        status: 'active',
        modules: ['roos', 'admin'],
        primaryContact: 'Marcus Tanner',
        contactEmail: 'marcus.t@bucees.com',
        monthlyRevenue: 48500,
      },
    ]);

    await PlatformMetricsModel.create({
      key: 'platform',
      platformUsers: 8438,
      storesUnderManagement: 10084,
      mrr: 308100,
      pendingApprovals: 7,
      guardrailsFired24h: 23,
      guardrailEscalations24h: 3,
      customRoles: 1,
      modulesDeployed: 6,
      countriesCount: 9,
    });

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'anjali@ithina.ai', password: 'SuperAdmin123!' });

    token = loginRes.body.data.accessToken;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  it('GET /health returns healthy', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/v1/auth/login returns JWT', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'anjali@ithina.ai', password: 'SuperAdmin123!' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('GET /api/v1/superadmin/dashboard/summary returns KPIs', async () => {
    const res = await request(app)
      .get('/api/v1/superadmin/dashboard/summary')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.platformUsers).toBe(8438);
    expect(res.body.data.mrr).toBe(308100);
    expect(res.body.data.pendingApprovals).toBe(7);
  });

  it('GET /api/v1/superadmin/dashboard/top-tenants returns sorted tenants', async () => {
    const res = await request(app)
      .get('/api/v1/superadmin/dashboard/top-tenants')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data[0].name).toBe('Żabka Group');
  });

  it('GET /api/v1/superadmin/dashboard/platform-health returns operational', async () => {
    const res = await request(app)
      .get('/api/v1/superadmin/dashboard/platform-health')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('operational');
  });

  it('rejects unauthenticated dashboard requests', async () => {
    const res = await request(app).get('/api/v1/superadmin/dashboard/summary');
    expect(res.status).toBe(401);
  });
});
