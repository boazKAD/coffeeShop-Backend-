import mongoose from "mongoose";
const Schema = new mongoose.Schema(
  {
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: mongoose.Types.ObjectId,
      ref: "order",
    },
    amount: Number,
    paidOn: { type: Date, default: Date.now() },
    method: { type: String, enum: ['card', 'cash', 'online'],},
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    deletedBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);
export default mongoose.model("Payment", Schema);
