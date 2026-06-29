import bcrypt from 'bcryptjs';
import { Schema, model, Document } from 'mongoose';

export interface AuthAccountDocument extends Document {
  externalId: string;
  email: string;
  passwordHash: string;
  userId: string;
  comparePassword(password: string): Promise<boolean>;
}

const authAccountSchema = new Schema<AuthAccountDocument>(
  {
    externalId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    userId: { type: String, required: true, index: true },
  },
  { timestamps: true },
);

authAccountSchema.methods.comparePassword = async function comparePassword(
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

export const AuthAccountModel = model<AuthAccountDocument>('AuthAccount', authAccountSchema);
