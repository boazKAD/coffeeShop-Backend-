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
    name: String,
    descreiption: String,
    price: Number,
    category: { type: String, enum: ["coffee", "tea", "snacks", "other"] },
    imageUrl: String,
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
export default mongoose.model("Acount", Schema);
