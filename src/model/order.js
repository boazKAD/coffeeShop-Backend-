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
    customer: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    items: [
      {
        type: mongoose.Types.ObjectId,
        ref: "OrderItem",
      },
    ],
    totalPrice: Number,
    status: { type: String, default: "pending" },
    promotion: {
      type: mongoose.Types.ObjectId,
      ref: "promotion",
    },
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

Schema.pre(/^find/, function (next) {
  this.populate({
    path: "items",
  });

  next();
})

export default mongoose.model("Order", Schema);
