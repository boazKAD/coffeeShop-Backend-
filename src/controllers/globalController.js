import Response from "../utils/Response";
import status from "http-status";
import "dotenv/config";
import { hashPassword } from "../utils/hashPassword";
import { model, Model } from "mongoose";
import APIFeatures from "../utils/apiFeatures";
import cloudinary from "../middleware/cloudinary";
import moment from "moment";
import user from "../model/user";
export const create = (Model) => async (req, res, next) => {
  try {
    const data = await Model.create(req.body);
    if (!data) {
      return Response.errorMessage(
        res,
        "failed to register",
        status.BAD_REQUEST
      );
    }
    if (req.body?.isNotify) {
      const { action, role, message, title } = req.body.notification;
      SuccessNotification({
        action,
        names: req?.user?.names,
        createdAt: new Date(),
        role,
        message,
        title,
      });
    }
    return Response.succesMessage(
      res,
      "Created Successfully",
      data,
      status.CREATED
    );
  } catch (error) {
    console.log(error);
    let statusCode = status.INTERNAL_SERVER_ERROR;
    let message = "Internal Server Error";
    if (error.code === 11000) {
      statusCode = status.CONFLICT;
      message = "Some data already exist";
    }
    Response.errorMessage(res, message, statusCode);
  }
};

export const getAlla = (Model, isUser) => async (req, res, next) => {
  try {
    const { field } = req.query;
    let joined = field?.toString().split(",").join(" ") || "-password -pin";
    if (isUser) {
      let check = joined.split(" ");
      if (check.includes("password") || check.includes("pin")) {
        joined = joined
          .split(" ")
          .filter((item) => {
            return item !== "password" && item !== "pin";
          })
          .join(" ");
      }
    }

    if (req.query.date) {
      const { date } = req.query;
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const searchCondition = {
        createdAt: {
          $gte: new Date(moment(formattedDate)),
          $lt: new Date(moment(formattedDate).add(moment.duration(1, "days"))),
        },
        isActive: true,
        isDelete: false,
      };

      const total = await Model.find(searchCondition)
        .select(`${joined}`)
        .count();

      let myQuery = { ...req.query };
      delete myQuery.field;
      delete myQuery.date;

      const features = new APIFeatures(
        Model.find(searchCondition).select(`${joined}`),
        myQuery
      )
        .filter()
        .sort()
        .limitFields()
        .paginate();

      const doc = await features.query;

      if (!doc) {
        return Response.errorMessage(res, "failed!", status.BAD_REQUEST);
      }
      return Response.succesMessage(
        res,
        `Retrieved successfully`,
        doc,
        status.OK,
        total
      );
    }

    if (req.query.sk) {
      const { sk } = req.query;

      const searchConditions = Object.keys(Model.schema.paths)
        .filter((field) => Model.schema.paths[field].instance === "String")
        .map((field) => ({
          [field]: { $regex: sk, $options: "i" },
        }));

      const total = await Model.find({
        $or: searchConditions,
        isActive: true,
        isDelete: false,
      })
        .select(`${joined}`)
        .count();

      let myQuery = { ...req.query };
      delete myQuery.field;
      delete myQuery.sk;

      const features = new APIFeatures(
        Model.find({
          $or: searchConditions,
          isActive: true,
          isDelete: false,
        }).select(`${joined}`),
        myQuery
      )
        .filter()
        .sort()
        .limitFields()
        .paginate();

      const doc = await features.query;
      if (!doc) {
        return Response.errorMessage(res, "failed!", status.BAD_REQUEST);
      }

      return Response.succesMessage(
        res,
        `Retrieved successfully`,
        doc,
        status.OK,
        total
      );
    }
    if (!req?.query?.isActive) {
      req.query.isActive = true;
    }
    if (!req?.query?.isDelete) {
      req.query.isDelete = false;
    }

    let myQuery = { ...req.query };
    delete myQuery.field;
    const features = new APIFeatures(Model.find().select(`${joined}`), myQuery)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    delete myQuery.limit;
    delete myQuery.page;

    const total = await Model.find(myQuery);
    console.log("🚀 ~ getAlla ~ total:", total)

    const doc = await features.query;
    if (!doc) {
      return Response.errorMessage(res, "failed!", status.BAD_REQUEST);
    }
    return Response.succesMessage(
      res,
      `Retrieved successfully`,
      doc,
      status.OK,
      total
    );
  } catch (error) {
    console.log(error);
    Response.errorMessage(
      res,
      "Internal Server Error",
      status.INTERNAL_SERVER_ERROR
    );
  }
};

export const getOneById = (Model) => async (req, res, next) => {
  try {
    const data = await Model.findById(req.params.id).select("-password -pin");
    if (!data) {
      return Response.errorMessage(
        res,
        "Failed to process. make sure this data exist!",
        status.BAD_REQUEST
      );
    }
    return Response.succesMessage(
      res,
      "Retrieved Sucessfully",
      data,
      status.OK
    );
  } catch (error) {
    console.log(error.message);
    return Response.errorMessage(
      res,
      "Internal Server Error",
      status.INTERNAL_SERVER_ERROR
    );
  }
};

// Update One By Id datas
export const updateOneById = (Model) => async (req, res, next) => {
  try {
    req.body.updatedBy = req.body.createdBy;
    delete req.body.createdBy;
    // Check if status is updated
    if (req.body.status) {
      req.body.statusUpdatedAt = new Date();
    }
    const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password -pin");
    if (!data) {
      return Response.errorMessage(
        res,
        "Failed to update. make sure data selected exist!",
        status.BAD_REQUEST
      );
    }
    if (req.body?.isNotify) {
      const { action, role, message, title } = req.body.notification;
      SuccessNotification({
        action,
        names: req?.user?.names,
        createdAt: new Date(),
        role,
        message,
        title,
      });
    }
    return Response.succesMessage(res, "Updated SuccesFully", data, status.OK);
  } catch (error) {
    console.log(error.message);
    Response.errorMessage(
      res,
      "Internal Server Error",
      status.INTERNAL_SERVER_ERROR
    );
  }
};

// delete One By Id datas
export const deleteOneById = (Model) => async (req, res, next) => {
  try {
    const data = await Model.findByIdAndDelete(req.params.id).select(
      "-password -pin"
    );
    if (!data) {
      return Response.errorMessage(
        res,
        "Failed to delete. make sure data selected exist!",
        status.BAD_REQUEST
      );
    }
    if (req.body?.isNotify) {
      const { action, role, message, title } = req.body.notification;
      SuccessNotification({
        action,
        names: req?.user?.names,
        createdAt: new Date(),
        role,
        message,
        title,
      });
    }
    return Response.succesMessage(res, "deleted SuccesFully", data, status.OK);
  } catch (error) {
    console.log(error.message);
    Response.errorMessage(
      res,
      "Internal Server Error",
      status.INTERNAL_SERVER_ERROR
    );
  }
};

// delete One By Id datas
export const deleteOneByStatus = (Model) => async (req, res, next) => {
  try {
    req.body.deletedBy = req.body.createdBy;
    delete req.body.createdBy;
    const data = await Model.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: true,
        isActive: false,
        deletedBy: req.body.deletedBy,
      },
      {
        new: true,
      }
    ).select("-password -pin");
    if (!data) {
      return Response.errorMessage(
        res,
        "Failed to delete. make sure data selected exist!",
        status.BAD_REQUEST
      );
    }
    if (req.body?.isNotify) {
      const { action, role, message, title } = req.body.notification;
      SuccessNotification({
        action,
        names: req?.user?.names,
        createdAt: new Date(),
        role,
        message,
        title,
      });
    }
    return Response.succesMessage(res, "deleted SuccesFully", data, status.OK);
  } catch (error) {
    console.log(error.message);
    Response.errorMessage(
      res,
      "Internal Server Error",
      status.INTERNAL_SERVER_ERROR
    );
  }
};

// get All By Filtering And Limit && Paginate && Sort

export const getAll = (Model) => async (req, res) => {
  try {
    const { field } = req.query;
    let joined = field?.toString().split(",").join(" ") || "-password -pin";

    if (req.query.date) {
      const { date } = req.query;
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const searchCondition = {
        createdAt: {
          $gte: new Date(moment(formattedDate)),
          $lt: new Date(moment(formattedDate).add(moment.duration(1, "days"))),
        },
        isActive: true,
        isDeleted: false,
      };

      const total = await Model.find(searchCondition)
        .select(`${joined}`)
        .count();

      let myQuery = { ...req.query };
      delete myQuery.field;
      delete myQuery.date;

      const features = new APIFeatures(
        Model.find(searchCondition).select(`${joined}`),
        myQuery
      )
        .filter()
        .sort()
        .limitFields()
        .paginate();

      const doc = await features.query;

      if (!doc) {
        return Response.errorMessage(res, "failed!", status.BAD_REQUEST);
      }

      return Response.succesMessage(
        res,
        `Retrieved successfully`,
        doc,
        status.OK,
        total
      );
    }

    if (req.query.sk) {
      const { sk } = req.query;

      const searchConditions = Object.keys(Model.schema.paths)
        .filter((field) => Model.schema.paths[field].instance === "String")
        .map((field) => ({
          [field]: { $regex: sk, $options: "i" },
        }));

      const total = await Model.find({
        $or: searchConditions,
        isActive: true,
        isDeleted: false,
      })
        .select(`${joined}`)
        .count();

      let myQuery = { ...req.query };
      delete myQuery.field;
      delete myQuery.sk;

      const features = new APIFeatures(
        Model.find({
          $or: searchConditions,
          isActive: true,
          isDeleted: false,
        }).select(`${joined}`),
        myQuery
      )
        .filter()
        .sort()
        .limitFields()
        .paginate();

      const doc = await features.query;
      if (!doc) {
        return Response.errorMessage(res, "failed!", status.BAD_REQUEST);
      }

      return Response.succesMessage(
        res,
        `Retrieved successfully`,
        doc,
        status.OK,
        total
      );
    }

    if (!req?.query?.isActive) {
      req.query.isActive = true;
    }
    if (!req?.query?.isDeleted) {
      req.query.isDeleted = false;
    }
    let myQuery = { ...req.query };
    delete myQuery.field;
    const features = new APIFeatures(Model.find().select(`${joined}`), myQuery)
      .filter()
      .sort()
      .limitFields()
      .paginate();
      
    delete myQuery.limit;
    delete myQuery.page;

    const total = await Model.find(myQuery).countDocuments();
    const doc = await features.query;
    if (!doc) {
      return Response.errorMessage(res, "failed!", status.BAD_REQUEST);
    }
    return Response.succesMessage(
      res,
      `Retrieved successfully`,
      doc,
      status.OK,
      total
    );
  } catch (error) {
    console.log(error);
    if (error.code == 31254) {
      return Response.errorMessage(
        res,
        "Excluding a field that doesn't exist",
        status.BAD_REQUEST
      );
    }
    Response.errorMessage(
      res,
      "Internal Server Error",
      status.INTERNAL_SERVER_ERROR
    );
  }
};

export const addImage = (Model) => async (req, res) => {
  try {
    let result;

    if (req.body && req.body.image) {
      const imageData = req.body.image;
      const imageBuffer = Buffer.from(imageData.split(",")[1], "base64");

      cloudinary.uploader
        .upload_stream((error, result) => {
          if (error) {
            return Response.errorMessage(
              res,
              "Failed to upload the image to Cloudinary",
              status.BAD_REQUEST
            );
          }

          return Response.succesMessage(res, "Success", result, status.OK);
        })
        .end(imageBuffer);
    } else if (req.file && req.file.path) {
      result = await cloudinary.uploader.upload(req.file.path);

      if (!result) {
        return Response.errorMessage(
          res,
          "Failed to upload the image to Cloudinary",
          status.BAD_REQUEST
        );
      }

      return Response.succesMessage(res, "Success", result, status.OK);
    } else {
      return Response.errorMessage(
        res,
        "Image data not provided in the request body or as a file",
        status.BAD_REQUEST
      );
    }
  } catch (error) {
    console.error(error.message);
    Response.errorMessage(
      res,
      "Internal Server Error",
      status.INTERNAL_SERVER_ERROR
    );
  }
};

// delete Selected One

export const deleteSome = (Model) => async (req, res) => {
  try {
    req.body.deletedBy = req.body.createdBy;
    delete req.body.createdBy;
    const selectedIds = req.body.selectedIds;
    // const status= req.query.isDeleted
    const data = await Model.updateMany(
      {
        _id: {
          $in: selectedIds,
        },
      },
      {
        $set: {
          isDeleted: true,
          isActive: false,
          deletedBy: req?.body?.deletedBy,
        },
      }
    );
    if (!data) {
      return Response.errorMessage(
        res,
        "Fail to process. make sure selected data exist!",
        status.BAD_REQUEST
      );
    }
    req.query.isDeleted = true;
    if (req.body?.isNotify) {
      const { action, role, message, title } = req.body.notification;
      SuccessNotification({
        action,
        names: req?.user?.names,
        createdAt: new Date(),
        role,
        message,
        title,
      });
    }
    return Response.succesMessage(res, "deleted Successfully", data, status.OK);
  } catch (error) {
    console.log(error.message);
    Response.errorMessage(
      res,
      "Internal Server Error",
      status.INTERNAL_SERVER_ERROR
    );
  }
};
