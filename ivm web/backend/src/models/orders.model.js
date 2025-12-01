import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  dest: { type: String, required: true },
  customer: { type: String, required: true },
  delivery: { type: String },
  carrier: { type: String },
  cost: { type: Number, default: 0 },
  status: { type: String, enum: ["Pending","Shipped","On Delivery","Delivered"], default: "Pending" },
  createdAt: { type: Date, default: () => new Date() }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
