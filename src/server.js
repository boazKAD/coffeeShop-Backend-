import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import Status from "http-status";
import http from "http";
import Response from "./utils/Response";
import routes from "./routes/index";

const app = express();
app.use(cors());

const server = http.createServer(app);

mongoose.set("strictQuery", false);
app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
app.use(express.json());
app.use(cookieParser());

app.use(morgan("dev"));
app.use("/v1/api", routes);
app.use((req, res, next) => {
  return Response.errorMessage(
    res,
    "Not Found ! Something Went Wrong",
    Status.NOT_FOUND
  );
});
const dbUrl =
  process.env.NODE_ENV === "production"
    ? process.env.DB_URL_PRODUCTION
    : process.env.DB_URL_DEV;
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log(
      `Database connected succesfully ${
        process.env.NODE_ENV === "production" ? "#Production" : "#Develop"
      } `
    );
  });

const port = process.env.NODE_ENV === "production" ? process.env.PORT : 3100;
server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

export default app;
