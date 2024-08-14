import { check, query, validationResult, param } from "express-validator";
import mongoose from "mongoose";
import Response from "../../utils/Response";

/**
 * @export
 * @class Validator
 *
 */

class Validator {
  /**
   * Validate Input
   * @static
   * @return {object} error description OR return next middleware
   */
  static validateInput = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.errors.map((err) => err.msg);
      return Response.errorMessage(res, errorMessage, 400);
    }
    return next();
  };

  /**
   * Validate Mongo ID
   * @static
   * @return {object} error
   */
  static IDsRules() {
    return [check("id", "Please Only Mongo ID Accepted !").isMongoId()];
  }
}
export default Validator;
