import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  name?: string;
  profilePhoto?: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  profilePhoto: { type: String },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
