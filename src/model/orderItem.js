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
    quantity: Number,
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
    path: "product",
  });

  next();
})
export default mongoose.model("OrderItem", Schema);
