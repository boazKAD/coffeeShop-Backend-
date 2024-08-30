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
    account:  {
      type: mongoose.Types.ObjectId,
      ref: "Account",
    },
    code: String,
    discount: Number,
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
    path: "createdBy",
  });
  this.populate({
    path: "account",
  });

  next();
})
export default mongoose.model("Promotion", Schema);
