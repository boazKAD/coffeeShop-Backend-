import productModel from "../model/product";
import {
  create,
  getAll,
  getOneById,
  updateOneById,
  deleteOneById,
} from "./globalController";

export const createController = create(productModel);
export const getAllController = getAll(productModel);
export const getOneController = getOneById(productModel);
export const updateOneController = updateOneById(productModel);
export const deleteOneController = deleteOneById(productModel);