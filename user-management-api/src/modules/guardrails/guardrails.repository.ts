import { GuardrailEventModel, GuardrailRuleModel, GuardrailEventDocument, GuardrailRuleDocument } from './guardrails.model';

export class GuardrailRepository {
  findRules(filter: Record<string, unknown>, skip: number, limit: number) {
    return GuardrailRuleModel.find(filter).sort({ name: 1 }).skip(skip).limit(limit);
  }

  countRules(filter: Record<string, unknown>) {
    return GuardrailRuleModel.countDocuments(filter);
  }

  findEvents(filter: Record<string, unknown>, skip: number, limit: number) {
    return GuardrailEventModel.find(filter).sort({ firedAt: -1 }).skip(skip).limit(limit);
  }

  countEvents(filter: Record<string, unknown>) {
    return GuardrailEventModel.countDocuments(filter);
  }

  countEventsSince(since: Date) {
    return GuardrailEventModel.countDocuments({ firedAt: { $gte: since } });
  }

  countEscalationsSince(since: Date) {
    return GuardrailEventModel.countDocuments({ firedAt: { $gte: since }, result: 'escalated' });
  }

  findRuleByExternalId(externalId: string) {
    return GuardrailRuleModel.findOne({ externalId });
  }

  createRule(data: Partial<GuardrailRuleDocument>) {
    return GuardrailRuleModel.create(data);
  }

  updateRuleByExternalId(externalId: string, data: Partial<GuardrailRuleDocument>) {
    return GuardrailRuleModel.findOneAndUpdate({ externalId }, data, { new: true });
  }

  deleteRuleByExternalId(externalId: string) {
    return GuardrailRuleModel.findOneAndDelete({ externalId });
  }
}

export const guardrailRepository = new GuardrailRepository();

export type { GuardrailEventDocument, GuardrailRuleDocument };
