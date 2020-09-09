const { body, param, oneOf, check} = require("express-validator");
const errorHandler = require("./errorHandler");

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
        .matches(/^[a-z0-9_.]{3,16}$/)
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
      .withMessage("UserId is required"),
    //   .matches(/^[a-z0-9_. A-Z]{1,16}$/)
    //   .withMessage("Please provide a valid firstName"),

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
      .matches(/^[A-Z0-9]{6}$/)
      .withMessage("Please provide a valid referral code"),
    
    body("packageStatus")
    .optional()
    .matches(/Pending|Approved|Denied/)
    .withMessage("Please provide a valid package status : pending or approved or denied "),

    body("verified")
    .optional()
    .matches(/true/)
    .withMessage("Verification can only be true."),



    //referred from, phoneNo,
    

    
    errorHandler,
  ],

  
};
