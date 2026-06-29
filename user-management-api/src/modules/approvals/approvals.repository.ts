import { ApprovalModel } from './approvals.model';

export class ApprovalRepository {
  findAll(filter: Record<string, unknown>, skip: number, limit: number) {
    return ApprovalModel.find(filter).sort({ requestedAt: -1 }).skip(skip).limit(limit);
  }

  count(filter: Record<string, unknown>) {
    return ApprovalModel.countDocuments(filter);
  }

  countPending() {
    return ApprovalModel.countDocuments({ status: 'pending' });
  }
}

export const approvalRepository = new ApprovalRepository();
