import { tenantRepository } from '../tenants/tenants.repository';
import { userRepository } from '../users/users.repository';
import { roleRepository } from '../roles/roles.repository';

export interface SearchResultDto {
  tenants: Array<{ id: string; name: string; industry: string }>;
  users: Array<{ id: string; name: string; email: string }>;
  roles: Array<{ id: string; name: string; type: string }>;
}

export class SearchService {
  async search(query: string, limit = 5): Promise<SearchResultDto> {
    const regex = { $regex: query, $options: 'i' };
    const [tenants, users, roles] = await Promise.all([
      tenantRepository.findAll(
        { $or: [{ name: regex }, { industry: regex }] },
        0,
        limit,
      ),
      userRepository.findAll(
        { $or: [{ name: regex }, { email: regex }] },
        0,
        limit,
      ),
      roleRepository.findAll({ name: regex }, 0, limit),
    ]);

    return {
      tenants: tenants.map((t) => ({
        id: t.externalId,
        name: t.name,
        industry: t.industry,
      })),
      users: users.map((u) => ({
        id: u.externalId,
        name: u.name,
        email: u.email,
      })),
      roles: roles.map((r) => ({
        id: r.externalId,
        name: r.name,
        type: r.type,
      })),
    };
  }
}

export const searchService = new SearchService();
