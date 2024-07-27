import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  phone: string;
  notes: string;
  label: 'Cancel' | 'Complete' | 'Progress';
}

const ContactSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String, required: true },
  label: { type: String, enum: ['Cancel', 'Complete', 'Progress'], required: true }
});

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);
