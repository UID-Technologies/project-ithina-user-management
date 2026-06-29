export function buildSearchFilter(fields: string[], search?: string): Record<string, unknown> {
  if (!search) return {};
  return {
    $or: fields.map((field) => ({ [field]: { $regex: search, $options: 'i' } })),
  };
}
