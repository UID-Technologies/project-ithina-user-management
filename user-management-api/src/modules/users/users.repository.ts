import { UserModel, UserDocument } from './users.model';

export class UserRepository {
  findAll(filter: Record<string, unknown>, skip: number, limit: number) {
    return UserModel.find(filter).sort({ name: 1 }).skip(skip).limit(limit);
  }

  count(filter: Record<string, unknown>) {
    return UserModel.countDocuments(filter);
  }

  findByExternalId(externalId: string) {
    return UserModel.findOne({ externalId });
  }

  create(data: Partial<UserDocument>) {
    return UserModel.create(data);
  }

  updateByExternalId(externalId: string, data: Partial<UserDocument>) {
    return UserModel.findOneAndUpdate({ externalId }, data, { new: true });
  }

  deleteByExternalId(externalId: string) {
    return UserModel.findOneAndDelete({ externalId });
  }

  countAll() {
    return UserModel.countDocuments();
  }
}

export const userRepository = new UserRepository();
