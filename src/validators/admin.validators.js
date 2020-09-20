const { body, param, oneOf, check } = require("express-validator");
const errorHandler = require("./errorHandler");
const config = require("../config");

const idRegex = new RegExp(`^[0-9A-Fa-f]{${config.DB_ID_LENGTH}}$`);

module.exports = {
  validateRegistration: () => [
    body("username")
      .exists()
      .withMessage("Username is required")
      .matches(/^[A-Za-z0-9_.]{3,16}$/)
      .withMessage("Please provide a valid username of length 3 to 16"),

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

    errorHandler,
  ],

  validateLogin: () => [
    check("username")
      .exists()
      .withMessage("Username is required")
      .matches(/^[a-z0-9_.]{3,25}$/)
      .withMessage("Please provide a avalid username"),

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

  validateUpdate: () => [
    body("userId")
      .exists()
      .withMessage("UserId is required")
      .matches(idRegex)
      .withMessage("Please provide a valid user id"),

    body("firstName")
      .optional()
      .matches(/^[a-z0-9_. A-Z]{1,16}$/)
      .withMessage("Please provide a valid firstName"),

    body("lastName")
      .optional()
      .matches(/^[a-z0-9_. A-Z]{1,16}$/)
      .withMessage("Please provide a valid lastName"),

    body("referralCode")
      .optional()
      .matches(/^[a-zA-Z0-9]{6}$/)
      .withMessage("Please provide a valid referral code"),

    body("packageStatus")
      .optional()
      .matches(/Pending|Approved|Denied/)
      .withMessage(
        "Please provide a valid package status : Pending or Approved or Denied "
      ),

    body("verified")
      .optional()
      .matches(/true/)
      .withMessage("Verification can only be true."),

    body("referredFrom")
      .optional()
      .matches(idRegex)
      .withMessage("Please provide a valid user id for referredFrom"),

    body("phone")
      .optional()
      .isNumeric()
      .withMessage("Phone number is required"),

    errorHandler,
  ],

  createPackage: () => [
    check("name")
      .exists()
      .withMessage("Package name is required")
      .matches(/^[a-zA-Z0-9_.]{3,25}$/)
      .withMessage("Please provide a valid package name")
      .bail(),

    check("price")
      .exists()
      .withMessage("Price is required")
      .matches(/^[0-9., -]{1,25}$/)
      .withMessage("Please provide valid price ")
      .bail(),

    check("profitRate")
      .exists()
      .withMessage("rate is required")
      .matches(/^[0-9.]{1,25}$/)
      .withMessage("Please provide valid rate ")
      .bail(),

    check("profitRangeStart")
      .exists()
      .withMessage("rate is required")
      .matches(/^[0-9.]{1,25}$/)
      .withMessage("Please provide valid rate ")
      .bail(),

    check("profitRangeEnd")
      .exists()
      .withMessage("rate is required")
      .matches(/^[0-9.]{1,25}$/)
      .withMessage("Please provide valid rate ")
      .bail(),

    errorHandler,
  ],
  deletePackage: () => [
    check("packageId")
      .exists()
      .withMessage("packageId is required")
      .matches(idRegex)
      .withMessage("Please provide a valid package id"),

    errorHandler,
  ],
  getUser: () => [
    param("userId")
      .exists()
      .withMessage("userId is required")
      .matches(idRegex)
      .withMessage("Please provide a valid user id"),

    errorHandler,
  ],
  getTransactionHistory: () => [
    param("walletId")
      .exists()
      .withMessage("walletId is required")
      .matches(idRegex)
      .withMessage("Please provide a valid wallet id"),

    errorHandler,
  ],

  updatePackage: () => [
    check("name")
      .optional()
      .matches(/^[a-z0-9_.]{3,25}$/)
      .withMessage("Please provide a valid package name")
      .bail(),

    check("price")
      .optional()
      .matches(/^[0-9., -]{1,25}$/)
      .withMessage("Please provide valid price ")
      .bail(),

    check("profitRate")
      .optional()
      .matches(/^[0-9.]{1,25}$/)
      .withMessage("Please provide valid rate ")
      .bail(),

    check("profitRangeStart")
      .optional()
      .matches(/^[0-9.]{1,25}$/)
      .withMessage("Please provide valid rate ")
      .bail(),

    check("profitRangeEnd")
      .optional()
      .matches(/^[0-9.]{1,25}$/)
      .withMessage("Please provide valid rate ")
      .bail(),

    errorHandler,
  ],

  validateTransactionStatusUpdate: () => [
    body("transactionId")
      .exists()
      .withMessage("transactionId is required")
      .bail()
      .matches(idRegex)
      .withMessage("Please provide a valid transactionId")
      .bail(),

      body("transactionStatus")
      .exists()
      .withMessage("transactionStatus is required")
      .bail()
      .matches(/Pending|Approved|Denied/)
      .withMessage("Please provide a valid transactionStatus: 'Pending', 'Approved' or 'Denied'"),

    errorHandler,
  ],
};
