import PaymentModel from "../model/payment";
import {
  create,
  getAll,
  getOneById,
  updateOneById,
  deleteOneById,
} from "./globalController";

export const createController = create(PaymentModel);
export const getAllController = getAll(PaymentModel);
export const getOneController = getOneById(PaymentModel);
export const updateOneController = updateOneById(PaymentModel);
export const deleteOneController = deleteOneById(PaymentModel);