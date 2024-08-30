import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    orderId: {
      type: String,
      unique: true,
    },
    customer: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    account: {
      type: mongoose.Types.ObjectId,
      ref: "Account",
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
      ref: "Promotion",
    },
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
    counter: {
      type: Number, 
      default: 0,
    },
    qid: {
      type: String,
      unique: true, 
      sparse: true, 
    },
  },
  { timestamps: true }
);

orderSchema.statics.getNextOrderId = async function () {
  const result = await this.findOneAndUpdate(
    { qid: "orderid_counter" },
    { $inc: { counter: 1 } },
    { new: true, upsert: true, fields: { counter: 1 } }
  );
  return result.counter;
};
orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const nextOrderId = await this.constructor.getNextOrderId();
      this.orderId = `#${String(nextOrderId).padStart(5, '0')}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

orderSchema.pre(/^find/, function (next) {
  this.populate("items");
  next();
});

export default mongoose.model("Order", orderSchema);
