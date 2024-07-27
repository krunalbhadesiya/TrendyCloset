import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  totalStock: number;
  currentStock: number;
  totalSells: number;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  totalStock: { type: Number, required: true },
  currentStock: { type: Number, required: true },
  totalSells: { type: Number, default: 0 }
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
