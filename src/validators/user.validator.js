const { body, param } = require("express-validator");
const errorHandler = require("./errorHandler");

module.exports = {
  validateRegistration: () => [
    body("firstName")
      .exists()
      .withMessage("firstName is required")
      .matches(/^[a-z0-9_. A-Z]{1,16}$/)
      .withMessage("Please provide a valid firstName"),

    body("lastName")
      .exists()
      .withMessage("lastName is required")
      .matches(/^[a-z0-9_. A-Z]{1,16}$/)
      .withMessage("Please provide a valid lastName"),

    body("username")
      .exists()
      .withMessage("Username is required")
      .matches(/^[a-z0-9_.]{3,16}$/)
      .withMessage("Please provide a valid username of length 3 to 16"),

    body("email")
      .exists()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please provide a valid email address"),

    body("password")
      .exists()
      .withMessage("Password is required")
      .isLength({
        min: 8,
      })
      .withMessage("Password must be at least 8 characters in length")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/
      )
      .withMessage(
        "Password should contain at least one letter, one number and one special character"
      ),
    
    body("phone")
      .exists()
      .withMessage("Phone number is required")
      .matches(
        /^\(?([0-9]{4})\)?[-]?([0-9]{3})[-]?([0-9]{4})$/
      )
      .withMessage("Phone number must be in this format XXXX-XXX-XXX"
      ),
      

    errorHandler,
  ],

  validateLogin: () => [
    oneOf([
      check("email")
        .exists()
        .withMessage("Username is required")
        .matches(/^[a-z0-9_.]{3,16}$/)
        .withMessage("Please provide a avalid username"),

      check("email")
        .exists()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a avalid email address"),
    ]),
    check("password", "Password is required").exists(),

    errorHandler,
  ],

  validateChangePassword: () => [
    check("currentPassword")
      .exists()
      .withMessage("Password is required")
      .isLength({
        min: 8,
      })
      .withMessage("Password must be at least 8 characters in length")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/
      )
      .withMessage(
        "Password should contain at least one letter, one number and one special character"
      ),

    check("newPassword")
      .exists()
      .withMessage("Password is required")
      .isLength({
        min: 8,
      })
      .withMessage("Password must be at least 8 characters in length")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/
      )
      .withMessage(
        "Password should contain at least one letter, one number and one special character"
      ),

    errorHandler,
  ],
};
