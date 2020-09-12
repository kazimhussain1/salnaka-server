const multer = require("multer");
const { extname } = require("path");
const deleteFile = require("../utils/deleteFile");
const { IMAGE_SIZE_LIMIT, VIDEO_SIZE_LIMIT } = require("../config");
const { errorConstants } = require("../constants");

const imageRegex = /jpeg|jpg|png|gif/;
const videoRegex = /mp4/;

function getMulterMiddleware(
  fieldName,
  destinationPath,
  allowVideo,
  numberOfFiles = 1
) {
  return async (req, res, next) => {
    // console.log(req.fields.userId, req.admin.id)

    const storage = multer.diskStorage({
      destination: destinationPath,
      filename: (req, file, cb) => {
        const fileType = file.mimetype.split("/");
        if (fileType[0] === "image") {
          const fileName =
            "img_" +
            new Date().toISOString().replace(/:/g, "-") +
            "_" +
            req.user==undefined ? req.user.id : req.body.userId +
            "." +
            fileType[1];
          cb(null, fileName);
          file.fileRelativeUrl = destinationPath + fileName;
        } else if (fileType[0] === "video") {
          const fileName =
            "video_" +
            new Date().toISOString().replace(/:/g, "-") +
            "_" +
            req.user.id +
            "." +
            fileType[1];
          cb(null, fileName);
          file.fileRelativeUrl = destinationPath + fileName;
        }
      },
    });

    let multerHandler = multer({
      storage,
      fileFilter: (req, file, cb) => {
        const imageTest =
          imageRegex.test(extname(file.originalname).toLowerCase()) &&
          imageRegex.test(file.mimetype);
        const videoTest =
          videoRegex.test(extname(file.originalname).toLowerCase()) &&
          videoRegex.test(file.mimetype);

        if (allowVideo === false && videoRegex) {
          const error = errorConstants.ERR_VIDEO_NOT_ALLOWED;
          req.multerError = error;
          return cb(null, false);
        } else if (imageTest) {
          return cb(null, true);
        } else if (videoTest) {
          return cb(null, true);
        } else {
          const error = errorConstants.ERR_MEDIA_TYPE_NOT_ALLOWED;
          error["uploadedMediaType"] = file.mimetype;
          error["allowedMediaTypes"] = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
          ];
          if (allowVideo) error["allowedMediaTypes"].push("video/mp4");

          cb(null, false);
          req.multerError = error;
        }
      },
    });
    if (numberOfFiles == 1) {
      multerHandler = multerHandler.single(fieldName);
    } else {
      multerHandler = multerHandler.array(fieldName, numberOfFiles);
    }
   multerHandler(req,res,next);
    // multerHandler(req, res, (error) => {
    //   console.log('here in multer error', error)
    //   if(error){
    //     req.multerError = {
    //       errorCode: 400,
    //       error: error.toString(),
    //     };
      
    //   res.status(400).send({
    //     errorCode: 400,
    //     error: error.toString(),
    //   });
    // }
    // });
  };
}

function handleMulterError(req, res, next) {
  const errors = [];

  if (req.multerError) {
    errors.push(req.multerError);
  }

  if (req.file) {
    const imageTest =
      imageRegex.test(extname(req.file.originalname).toLowerCase()) &&
      imageRegex.test(req.file.mimetype);
    const videoTest =
      videoRegex.test(extname(req.file.originalname).toLowerCase()) &&
      videoRegex.test(req.file.mimetype);

    if (imageTest && req.file.size > IMAGE_SIZE_LIMIT) {
      const error = errorConstants.ERR_IMAGE_SIZE_EXCEEDED;
      error["fileName"] = req.file.originalname;
      errors.push(error);
    } else if (videoTest && req.file.size > VIDEO_SIZE_LIMIT) {
      const error = errorConstants.ERR_VIDEO_NOT_ALLOWED;
      error["fileName"] = req.file.originalname;
      errors.push(error);
    }
  }

  if (req.files) {
    req.files.forEach((file) => {
      const imageTest =
        imageRegex.test(extname(file.originalname).toLowerCase()) &&
        imageRegex.test(file.mimetype);
      const videoTest =
        videoRegex.test(extname(file.originalname).toLowerCase()) &&
        videoRegex.test(file.mimetype);

      if (imageTest && file.size > IMAGE_SIZE_LIMIT) {
        const error = errorConstants.ERR_IMAGE_SIZE_EXCEEDED;
        error["fileName"] = file.originalname;
        errors.push(error);
      } else if (videoTest && file.size > VIDEO_SIZE_LIMIT) {
        const error = errorConstants.ERR_VIDEO_NOT_ALLOWED;
        error["fileName"] = file.originalname;
        errors.push(error);
      }
    });
  }

  if (errors.length > 0) {
    if (errors.length == 1) {
      res.status(errors[0].errorCode).json(errors[0]);
    } else {
      res.status(400).json({
        errors,
      });
    }

    if (req.file) {
      if (req.file.fileRelativeUrl) {
        deleteFile(req.file.fileRelativeUrl);
      }
    }
    if (req.files) {
      req.files.forEach((file) => {
        if (file.fileRelativeUrl) {
          deleteFile(file.fileRelativeUrl);
        }
      });
    }
  } else {
    next();
  }
}

module.exports = {
  getMulterMiddleware,
  handleMulterError,
};
