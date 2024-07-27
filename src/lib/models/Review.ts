import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  username: string;
  customerName: string;
  productId: string;
  productName: string;
  rating: number;
  comment: string;
  testimonial?: string;
}

const ReviewSchema: Schema = new Schema({
  username: { type: String, required: true },
  customerName: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  testimonial: { type: String }
});

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
