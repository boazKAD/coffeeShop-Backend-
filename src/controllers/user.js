import UserModel from "../model/user";
import {
  create,
  getAll,
  getOneById,
  updateOneById,
  deleteOneById,
} from "./globalController";
import httpStatus from "http-status";
import user from "../model/user";
import Response from "../utils/Response";
import { hashPassword, isPasswordMatching } from "../utils/hashPassword";

export const createController = create(UserModel);
export const getAllController = getAll(UserModel);
export const getProfile = (req, res) => {
  return Response.succesMessage(res, "success", req.user, httpStatus.OK);
};
export const getOneController = getOneById(UserModel);
export const updateOneController = updateOneById(UserModel);
export const deleteOneController = deleteOneById(UserModel);

export const getUserInfo = async (req, res) => {
  try {
    const { Email } = req.params;
    const result = await UserModel.findOne({ email: Email }).select(
      "email names picture role"
    );
    if (!result) {
      return Response.errorMessage(
        res,
        "User with this  Email Not Found",
        httpStatus.NOT_FOUND
      );
    }

    return Response.succesMessage(res, "Success", result, httpStatus.OK);
  } catch (error) {
    return Response.errorMessage(
      res,
      error.message,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return Response.errorMessage(
        res,
        "User with this  Email Not Found",
        httpStatus.NOT_FOUND
      );
    }
    user.password = hashPassword(newPassword);
    // user.pin = hashPassword(newPassword);
    await user.save();
    return Response.succesMessage(res, "Password updated successfully");
  } catch (error) {
    return Response.errorMessage(
      res,
      error.message,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const updatePin = async (req, res) => {
  try {
    const { email, currentPin, newPin } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return Response.errorMessage(
        res,
        "User with this  Email Not Found",
        httpStatus.NOT_FOUND
      );
    }
    if (user.pin === currentPin) {
      user.pin = newPin;
      await user.save();
      return Response.succesMessage(res, "Pin updated successfully");
    } else {
      return Response.errorMessage(
        res,
        "Current Pin is incorrect",
        httpStatus.BAD_REQUEST
      );
    }
  } catch (error) {
    return Response.errorMessage(
      res,
      error.message,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const sendPasswordResetLink = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    let token = user.createPasswordResetToken();
    if (!user)
      return Response.errorMessage(
        res,
        "User with this email does not exist",
        httpStatus.NOT_FOUND
      );

    const emailTemplate = PasswordResetTemplate(user, token);
    transporter.sendMail(
      {
        from: process.env.email,
        to: `${user.email}`,
        subject: "Password reset",
        html: emailTemplate,
      },
      (err, info) => {
        if (err)
          return Response.errorMessage(
            res,
            "Failed to send password reset email",
            err,
            httpStatus.BAD_REQUEST
          );
        return Response.succesMessage(
          res,
          "Email sent successfully",
          null,
          httpStatus.OK
        );
      }
    );
  } catch (err) {
    return Response.errorMessage(
      res,
      err.message,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const checkResetPasswordToken = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      passwordResetToken: req.params.resetToken,
    });
    if (!user)
      return Response.errorMessage(
        res,
        "This token does not exist!",
        httpStatus.NOT_FOUND
      );

    const passwordResetExpire = new Date(parseInt(user.passwordResetExpire));
    const now = new Date();
    if (passwordResetExpire < now)
      return Response.errorMessage(
        res,
        "This token has expired",
        httpStatus.BAD_REQUEST
      );

    return Response.succesMessage(res, "Token is still valid", httpStatus.OK);
  } catch (err) {
    console.log(err.message);
    return Response.errorMessage(
      res,
      err.message,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const updatePasswordWithResetToken = async (req, res) => {
  try {
    const { confirmPassword, newPassword } = req.body;
    const { resetToken } = req.params;

    if (!resetToken)
      return Response.errorMessage(
        res,
        "Reset token not found!",
        httpStatus.BAD_REQUEST
      );

    if (!newPassword && !confirmPassword)
      return Response.errorMessage(
        res,
        "Passwords are needed",
        httpStatus.BAD_REQUEST
      );

    const user = await UserModel.findOne({
      passwordResetToken: req.params.resetToken,
    });

    if (!user) {
      return Response.errorMessage(res, "User Not Found", httpStatus.NOT_FOUND);
    }

    const passwordResetExpire = new Date(parseInt(user.passwordResetExpire));
    const now = new Date();

    if (passwordResetExpire < now)
      return Response.errorMessage(
        res,
        "This token has expired",
        httpStatus.BAD_REQUEST
      );

    if (confirmPassword != newPassword)
      return Response.errorMessage(
        res,
        "Passwords does not match",
        httpStatus.BAD_REQUEST
      );

    user.password = hashPassword(newPassword);
    await user.save();

    return Response.succesMessage(res, "Password updated successfully");
  } catch (error) {
    return Response.errorMessage(
      res,
      error.message,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const getAgentsCounts = async (req, res) => {
  try {
    const counts = await user.aggregate([
      {
        $match: { role: "sales-agent", isDeleted: false, isActive: true },
      },
      {
        $group: {
          _id: "$tag",
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$tag",
          totalCount: { $sum: "$count" },
          tag: { $push: "$$ROOT" },
        },
      },

      {
        $project: {
          _id: 0,
          totalCount: 1,
          tag: 1,
        },
      },
    ]);
    const result = { totalCount: counts[0]?.totalCount };
    counts[0]?.tag?.forEach((tagObj) => {
      result[tagObj?._id] = tagObj?.count;
    });
    return Response.succesMessage(
      res,
      "Data retrieved successfully",
      result,
      httpStatus.OK
    );
  } catch (error) {
    console.log(error);
    return Response.errorMessage(
      res,
      "Internal server error",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};
