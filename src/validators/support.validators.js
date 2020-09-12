const { body, param, oneOf, check} = require("express-validator");
const errorHandler = require("./errorHandler");

module.exports = {
  supportForm: () => [
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

    body("email")
      .exists()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please provide a valid email address"),

      body("phone")
      .exists()
      .isNumeric()
      .withMessage("Phone number is required"),

      body("subject")
      .exists()
      .withMessage("subject is required"),

      body("message")
      .exists()
      .withMessage("message is required"),
    
    
      

    errorHandler,
  ],
}