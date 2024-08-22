import { Router } from "express";
import * as OrderItemController from "../controllers/orderItemController";
import { verifyUserToken } from "../middleware/verifyToken";
import CheckMongoId from "../middleware/Validator/mustBeID";

const route = Router();
route.use(verifyUserToken);
route
  .route("/")
  .post(OrderItemController.createController)
  .get(OrderItemController.getAllController);

route
  .route("/pin/:id")
  .patch(
    CheckMongoId.IDsRules(),
    CheckMongoId.validateInput,
    OrderItemController.updateOneController
  );
route
  .route("/one/:id")
  .patch(
    CheckMongoId.IDsRules(),
    CheckMongoId.validateInput,
    // updateUser,
    OrderItemController.updateOneController
  )
  .get(
    CheckMongoId.IDsRules(),
    CheckMongoId.validateInput,
    OrderItemController.getOneController
  )
  .delete(
    CheckMongoId.IDsRules(),
    CheckMongoId.validateInput,
    OrderItemController.deleteOneController
  );

export default route;
