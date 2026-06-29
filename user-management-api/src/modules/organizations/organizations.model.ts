import { Schema, model, Document } from 'mongoose';
import { LocationType } from '../../common/enums';

export interface LocationDocument extends Document {
  externalId: string;
  tenantId: string;
  name: string;
  type: LocationType;
  parentId: string | null;
  code?: string;
}

const locationSchema = new Schema<LocationDocument>(
  {
    externalId: { type: String, required: true, unique: true },
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    parentId: { type: String, default: null },
    code: { type: String },
  },
  { timestamps: true },
);

export const LocationModel = model<LocationDocument>('Location', locationSchema);
