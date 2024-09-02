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
    account:  {
      type: mongoose.Types.ObjectId,
      ref: "Account",
    },
    amount: Number,
    paidOn: { type: Date, default: Date.now() },
    method: { type: String, enum: ['card', 'cash', 'online'],},
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    deletedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
Schema.pre(/^find/, function (next) {
  this.populate({
    path: "account",
  });

  next();
})
export default mongoose.model("Payment", Schema);
