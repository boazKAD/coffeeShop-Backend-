import OrderItemModel from "../model/orderItem";
import {
  create,
  getAll,
  getOneById,
  updateOneById,
  deleteOneById,
} from "./globalController";

export const createController = create(OrderItemModel);
export const getAllController = getAll(OrderItemModel);
export const getOneController = getOneById(OrderItemModel);
export const updateOneController = updateOneById(OrderItemModel);
export const deleteOneController = deleteOneById(OrderItemModel);