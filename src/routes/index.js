import express from "express";
import userRoutes from "./userRoute";
const app = express();
app.use("/user", userRoutes);

export default app;
