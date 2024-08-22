import PromotionModel from "../model/promotion";
import {
  create,
  getAll,
  getOneById,
  updateOneById,
  deleteOneById,
} from "./globalController";

export const createController = create(PromotionModel);
export const getAllController = getAll(PromotionModel);
export const getOneController = getOneById(PromotionModel);
export const updateOneController = updateOneById(PromotionModel);
export const deleteOneController = deleteOneById(PromotionModel);