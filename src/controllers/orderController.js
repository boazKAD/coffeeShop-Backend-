import httpStatus from "http-status";
import OrderModel from "../model/order";
import orderItemModel from "../model/orderItem";
import Response from "../utils/Response";
import {
  create,
  getAll,
  getOneById,
  updateOneById,
  deleteOneById,
} from "./globalController";

export const createController = create(OrderModel);
export const getAllController = getAll(OrderModel);
export const getOneController = getOneById(OrderModel);
export const updateOneController = updateOneById(OrderModel);
export const deleteOneController = deleteOneById(OrderModel);

export const createOder = async (req, res) => {
  try {
    const { quantity, product } = req.body;
    const orderItem = await orderItemModel.create({ quantity, product });
    if (orderItem) {
      const order = await OrderModel.create({ items: [orderItem._id] });
      console.log(order);
      return Response.succesMessage(res, "Order created successfully", order, httpStatus.OK);
    } else {
      return Response.errorMessage(
        res,
        "Failed to create order item",
        httpStatus.CONFLICT
      );
    }
  } catch (error) {
    console.log(error);
    return Response.errorMessage(
      res,
      errorMessage,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};
