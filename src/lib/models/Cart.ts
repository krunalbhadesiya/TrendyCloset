import mongoose, { Schema, Document } from 'mongoose';

export interface ICart extends Document {
  username: string;
  productIds: string[];
  productNames: string[];
  cartCount: number;
}

const CartSchema: Schema = new Schema({
  username: { type: String, required: true },
  productIds: [{ type: Schema.Types.ObjectId, ref: 'Product', required: true }],
  productNames: [{ type: String, required: true }],
  cartCount: { type: Number, required: true }
});

export default mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);
