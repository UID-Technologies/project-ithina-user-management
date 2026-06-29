import { AuthAccountModel } from './auth.model';

export class AuthRepository {
  findByEmail(email: string) {
    return AuthAccountModel.findOne({ email: email.toLowerCase() });
  }

  findByUserId(userId: string) {
    return AuthAccountModel.findOne({ userId });
  }

  create(data: { externalId: string; email: string; passwordHash: string; userId: string }) {
    return AuthAccountModel.create(data);
  }
}

export const authRepository = new AuthRepository();
