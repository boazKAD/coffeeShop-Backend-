import { Router } from "express";
import * as UserController from "../controllers/user";
import {
  checkUser,
  loginUser,
  resetPassword,
  updateUser,
  testUserAPis,
  loginWithEmailAndNID,
  socialAuth,
} from "../middleware/checkUserExist";
import { verifyUserToken } from "../middleware/verifyToken";
import AuthValidator from "../middleware/Validator/auth";
import CheckMongoId from "../middleware/Validator/mustBeID";

const route = Router();
// This Will Be Used Once For Creating An Admin
route.post("/register", checkUser, UserController.createController);
route.post("/reset/pwd", resetPassword);
route.post("/login", AuthValidator.validateInput, loginUser);
route.post(
  "/loginwithnid",
  AuthValidator.loginWithNIDRules(),
  AuthValidator.validateInput,
  loginWithEmailAndNID
);
route.route("/reset/password-link").post(UserController.sendPasswordResetLink);
route
  .route("/reset/check-link/:resetToken")
  .get(UserController.checkResetPasswordToken);
route
  .route("/reset/password/:resetToken")
  .post(UserController.updatePasswordWithResetToken);
route.post("/socialAuth", socialAuth);
route.get("/userInfo/:Email", UserController.getUserInfo);
route.route("/password").patch(UserController.updatePassword);
route.route("/reset/pin").patch(UserController.updatePin);
// route.use(checkModelById(user));
route
  .route("/")
  // This Is For Creating Other Users But You've To Be Verified First
  .post(checkUser, UserController.createController)
  .get(testUserAPis, UserController.getAllController);

route
  .route("/pin/:id")
  .patch(
    CheckMongoId.IDsRules(),
    CheckMongoId.validateInput,
    UserController.updateOneController
  );
route
  .route("/one/:id")
  .patch(
    CheckMongoId.IDsRules(),
    CheckMongoId.validateInput,
    // updateUser,
    UserController.updateOneController
  )
  .get(
    CheckMongoId.IDsRules(),
    CheckMongoId.validateInput,
    UserController.getOneController
  )
  .delete(
    CheckMongoId.IDsRules(),
    CheckMongoId.validateInput,
    UserController.deleteOneController
  );
route.route("/agentCounts").get(UserController.getAgentsCounts);
route.use(verifyUserToken);
route.route("/profile").get(UserController.getProfile);

export default route;
