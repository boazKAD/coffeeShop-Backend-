import { Router } from "express";
import * as PaymentController from "../controllers/paymentController";
import { verifyUserToken } from "../middleware/verifyToken";
import CheckMongoId from "../middleware/Validator/mustBeID";

const route = Router();
route.use(verifyUserToken);
route
  .route("/")
  .post(PaymentController.createController)
  .get(PaymentController.getAllController);

route
  .route("/pin/:id")
  .patch(
    CheckMongoId.IDsRules(),
    CheckMongoId.validateInput,
    PaymentController.updateOneController
  );
route
  .route("/one/:id")
  .patch(
    CheckMongoId.IDsRules(),
    CheckMongoId.validateInput,
    // updateUser,
    PaymentController.updateOneController
  )
  .get(
    CheckMongoId.IDsRules(),
    CheckMongoId.validateInput,
    PaymentController.getOneController
  )
  .delete(
    CheckMongoId.IDsRules(),
    CheckMongoId.validateInput,
    PaymentController.deleteOneController
  );

export default route;
