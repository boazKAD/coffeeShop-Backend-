import UserModel from "../model/user";
import { hashPassword, isPasswordMatching } from "../utils/hashPassword";
import Response from "../utils/Response";
import status from "http-status";
import { decodeSocialAuthToken, generateToken } from "../utils/token";

export const checkUser = async (req, res, next) => {
  let { email, password, pin } = req.body;

  const user = await UserModel.findOne({ email, isActive: true });
  if (!user) {
    req.body.password = hashPassword(password || "12345");
    req.body.pin = pin ?? "0000";

    return next();
  }
  return Response.errorMessage(res, "user is arleady exist", status.CONFLICT);
};
export const testUserAPis = async (req, res, next) => {
  console.log(
    "---------------------------------------------------------------->?"
  );
  return next();
};
export const resetPassword = async (req, res, next) => {
  let { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    return Response.errorMessage(res, "user is not exist", status.CONFLICT);
  }
  if (req.body.password) {
    req.body.password = hashPassword(password || "12345");
  }

  await UserModel.findOneAndUpdate({ email }, { password: req.body.password });
  return Response.succesMessage(res, "Password updated!", {}, status.OK);
};
export const updateUser = async (req, res, next) => {
  let { email, password, pin } = req.body;
  const user = await UserModel.findById(req.params.id);

  if (!user) {
    return Response.errorMessage(res, "user is not exist", status.CONFLICT);
  }
  req.body.password = hashPassword(password || "12345");
  req.body.pin = pin ?? "0000";
  // await UserModel.findOneAndUpdate({ email },req.body);
  return next();
};
//  Login Api
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  // Check if password is provided
  if (!password) {
    return Response.errorMessage(
      res,
      "Please provide a password",
      status.BAD_REQUEST
    );
  }

  if (!isValidEmail(email) && !isValidNID(email)) {
    return Response.errorMessage(
      res,
      "Please provide a valid 16-digit NID or a valid email address",
      status.BAD_REQUEST
    );
  }
  const user = await UserModel.findOne({
    $or: [{ email: email }, { nid: email }],
  });

  if (!user) {
    return Response.errorMessage(
      res,
      "Please provide a valid email or nid address",
      status.NOT_FOUND
    );
  }
  if (!user?.isActive || user.isDeleted) {
    return Response.errorMessage(
      res,
      "Unauthorised! Your Account has been deactivated, Please contact Administrator!",
      status.BAD_REQUEST
    );
  }
  if (isPasswordMatching(password, user.password) || user.pin === password) {
    user.password = null;
    // const user = user._id;
    const token = generateToken({ user: user._id, role: user.role });
    res.cookie("authToken", token, { maxAge: 1000 * 3600 * 24 });
    return Response.succesMessage(
      res,
      "Successfully logged in",
      { token },
      status.OK
    );
  }
  if (password) {
    if (!isPasswordMatching(password, user.password) && user.pin !== password) {
      return Response.errorMessage(
        res,
        "Please provide a valid password or PIN code",
        status.BAD_REQUEST
      );
    }
  }
  return Response.errorMessage(
    res,
    "Please provide a valid password or PIN code address",
    status.BAD_REQUEST
  );
};
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidNID(nid) {
  return /^[0-9]{16}$/.test(nid);
}

export const loginWithEmailAndNID = async (req, res) => {
  try {
    const { email, nid } = req.body;
    const user = await UserModel.findOne({ email, nid });

    if (!user) {
      return Response.errorMessage(
        res,
        "Please provide a valid email or National ID Number",
        status.NOT_FOUND
      );
    }
    if (!user?.isActive) {
      return Response.errorMessage(
        res,
        "Unauthorised! Your Account has been deactivated, Please contact Administrator!",
        status.BAD_REQUEST
      );
    }
    user.password = null;
    user.pin = null;
    const token = generateToken({ user });
    res.cookie("authToken", token, { maxAge: 1000 * 3600 * 24 });
    return Response.succesMessage(
      res,
      "Successfully logged in",
      { token },
      status.OK
    );
  } catch (error) {
    return Response.errorMessage(res, error, status.BAD_REQUEST);
  }
};

export const socialAuth = async (req, res) => {
  try {
    const socialAuthToken = req.body.socialAuthToken;
    const decodedToken = await decodeSocialAuthToken(socialAuthToken);
    const { email } = decodedToken;
    if (!email) {
      return Response.errorMessage(res, "email not found", status.NOT_FOUND);
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return Response.errorMessage(
        res,
        "user with this email doesn't exist",
        status.NOT_FOUND
      );
    }
    return Response.succesMessage(
      res,
      "logged in succesfully",
      user,
      status.OK
    );
  } catch (error) {
    console.log(error);
    return Response.errorMessage(
      res,
      "failed to log in",
      status.INTERNAL_SERVER_ERROR
    );
  }
};
