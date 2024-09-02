import accountModel from "../model/account";
import {
  create,
  getAll,
  getOneById,
  updateOneById,
  deleteOneById,
} from "./globalController";

export const createController = create(accountModel);
export const getAllController = getAll(accountModel);
export const getOneController = getOneById(accountModel);
export const updateOneController = updateOneById(accountModel);
export const deleteOneController = deleteOneById(accountModel);