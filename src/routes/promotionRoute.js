import { Router } from "express";
import * as PromotionController from "../controllers/promotionController";
import { verifyUserToken } from "../middleware/verifyToken";
import CheckMongoId from "../middleware/Validator/mustBeID";

const route = Router();
route.use(verifyUserToken);
route
  .route("/")
  .post(PromotionController.createController)
  .get(PromotionController.getAllController);

route
  .route("/pin/:id")
  .patch(
    CheckMongoId.IDsRules(),
    CheckMongoId.validateInput,
    PromotionController.updateOneController
  );
route
  .route("/one/:id")
  .patch(
    CheckMongoId.IDsRules(),
    CheckMongoId.validateInput,
    // updateUser,
    PromotionController.updateOneController
  )
  .get(
    CheckMongoId.IDsRules(),
    CheckMongoId.validateInput,
    PromotionController.getOneController
  )
  .delete(
    CheckMongoId.IDsRules(),
    CheckMongoId.validateInput,
    PromotionController.deleteOneController
  );

export default route;
