import { Router } from "express";
import * as ProductController from "../controllers/productController";
import { verifyUserToken } from "../middleware/verifyToken";
import CheckMongoId from "../middleware/Validator/mustBeID";

const route = Router();
route.use(verifyUserToken);
route
  .route("/")
  .post(ProductController.createController)
  .get(ProductController.getAllController);

route
  .route("/pin/:id")
  .patch(
    CheckMongoId.IDsRules(),
    CheckMongoId.validateInput,
    ProductController.updateOneController
  );
route
  .route("/one/:id")
  .patch(
    CheckMongoId.IDsRules(),
    CheckMongoId.validateInput,
    // updateUser,
    ProductController.updateOneController
  )
  .get(
    CheckMongoId.IDsRules(),
    CheckMongoId.validateInput,
    ProductController.getOneController
  )
  .delete(
    CheckMongoId.IDsRules(),
    CheckMongoId.validateInput,
    ProductController.deleteOneController
  );

export default route;
