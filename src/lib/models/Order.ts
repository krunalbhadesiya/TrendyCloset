import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  username: string;
  customerName: string;
  orderCreatedAt: Date;
  productId: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  deliveryDate?: Date;
  amount: number;
  qty: number;
}

const OrderSchema: Schema = new Schema({
  username: { type: String, required: true },
  customerName: { type: String, required: true },
  orderCreatedAt: { type: Date, default: Date.now },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  status: { type: String, enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], required: true },
  deliveryDate: { type: Date },
  amount: { type: Number, required: true },
  qty: { type: Number, required: true }
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
