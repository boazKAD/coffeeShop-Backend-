import { check, query, validationResult } from "express-validator";
import Response from "../../utils/Response";
import moment from "moment";

/**
 * @export
 * @class Validator
 */
class Validator {
  /**
   * Validate input
   * @static
   * @returns {object} error description OR return next middleware
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
   * Validate new account input
   * @static
   * @returns {object} errors
   */
  static newAccountRules() {
    return [
      check("firstName", "first name should be valid").trim().isAlpha(),
      check("lastName", "last name should be valid").trim(),
      check("email", "email should be valid").trim().isEmail(),
      check(
        "password",
        "A valid password should have a character, number, UPPER CASE letter and a lower case letter and should be longer than 8"
      )
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
        .custom((value, { req, loc, path }) => {
          if (value !== req.body.confirmPassword) {
            throw new Error("Passwords don't match");
          } else {
            return value;
          }
        }),
    ];
  }

  /**
   * Validate login input
   * @static
   * @returns {object} errors
   */

  /**
   * Validate login input
   * @static
   * @returns {object} errors
   */
  static loginWithNIDRules() {
    return [
      check("email", "Email should be valid").trim().isEmail(),
      check("nid", "National Identification Number should be valid")
        .isLength({ min: 16, max: 16 })
        .isNumeric(),
    ];
  }
}
export default Validator;
