import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  color: string;
  size: string;
  price: number;
  totalStock: number;
  currentStock: number;
  totalSells: number;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  color: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  totalStock: { type: Number, required: true },
  currentStock: { type: Number, default: 0 },  
  totalSells: { type: Number, default: 0 }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false }
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
