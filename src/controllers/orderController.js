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
    const { items, totalPrice } = req.body;

    const orderItems = await Promise.all(
      items.map(async (item) => {
        const { quantity, products } = item;
        return await orderItemModel.create({
          quantity,
          product: products,
        });
      })
    );

    if (orderItems.length) {
      const order = await OrderModel.create({
        items: orderItems.map((item) => item._id),
        totalPrice: totalPrice,
      });
      return Response.succesMessage(
        res,
        "Order created successfully",
        order,
        httpStatus.CREATED
      );
    } else {
      return Response.errorMessage(
        res,
        "Failed to create order items",
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
