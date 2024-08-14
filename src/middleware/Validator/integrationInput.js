import { check, validationResult } from "express-validator";
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
   * Validate integration inputs
   * @static
   * @return {object} error
   */
  static integrationInputRules() {
    return [
      check("name").trim().notEmpty().withMessage("Name must not be empty"),
      check("description")
        .trim()
        .notEmpty()
        .withMessage("Description must not be empty"),
      check("apis.*.*")
        .trim()
        .notEmpty()
        .withMessage((value, { path }) => {
          // accessing api fields
          const field = path.split(".")[1];
          return `${field} must not be empty`;
        }),
    ];
  }
}
export default Validator;
