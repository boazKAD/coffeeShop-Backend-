import Response from "../utils/Response";
import status from "http-status";
import { decodeToken } from "../utils/token";
import UserModel from "../model/user";
import { response } from "express";
export const verifyUserToken = async (req, res, next) => {
  try {
    const token =
      req.header("authToken") ||
      req.params["authToken"] ||
      req.body.token ||
      req.query["authToken"] ||
      req.cookies.authToken;
    if (!token) {
      return Response.errorMessage(
        res,
        "Please your are not authorized to access this information! Please login with true credentials!",
        status.UNAUTHORIZED
      );
    }
    const payload = decodeToken(token);
    const { name } = payload;
    req.user = payload;
    req.body.createdBy = payload;
    if (name === "JsonWebTokenError") {
      return Response.errorMessage(
        res,
        "unauthorized, invalid token",
        status.UNAUTHORIZED
      );
    } else if (name === "TokenExpiredError") {
      return Response.errorMessage(
        res,
        "Token expired, invalid token",
        status.UNAUTHORIZED
      );
    }

    const user = await UserModel.findOne({ _id: payload?.user }).select(
      "-password"
    );
    if (!user) {
      return Response.errorMessage(
        res,
        "User from token not exist, invalid token",
        status.UNAUTHORIZED
      );
    }
    req.user = user;
    req.token = token;
    req.body.createdBy = user._id;
    
    return next();
  } catch (error) {
    console.log(error.message);
    if (error?.message === "jwt expired") {
      console.log("))))))))");
      return Response.errorMessage(
        res,
        "Your session has been expired! Please re-login!",
        status.UNAUTHORIZED
      );
    }
    return Response.errorMessage(
      res,
      "FAILED TO VERIFY TOKEN !",
      status.INTERNAL_SERVER_ERROR
    );
  }
};
