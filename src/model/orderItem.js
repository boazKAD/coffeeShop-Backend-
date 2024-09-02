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
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
    account:  {
      type: mongoose.Types.ObjectId,
      ref: "Account",
    },
    quantity: Number,
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
    path: "product",
  });
  this.populate({
    path: "account",
  });

  next();
})
export default mongoose.model("OrderItem", Schema);
