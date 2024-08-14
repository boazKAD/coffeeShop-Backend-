import { check, query, validationResult } from "express-validator";

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
   * Validate Price List Item Fileds
   * @static
   * @return {object} error
   */
  static FieldRules() {
    return [
      check("value", "Value Must Be Number  !").isInt(),
    ];
  }
}
export default Validator;
