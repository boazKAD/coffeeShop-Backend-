import express from "express";
import userRoutes from "./userRoute";
import productRoutes from "./productRoute";
import orderRoutes from "./orderRoute";
import orderItemRoutes from "./orderItemRoute";
import promotionRoutes from "./promotionRoute";
import paymentRoutes from "./paymentRoute";
const app = express();
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);
app.use("/orderItem", orderItemRoutes);
app.use("/promotion", promotionRoutes);
app.use("/payment", paymentRoutes);

export default app;
