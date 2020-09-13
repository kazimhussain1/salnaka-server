const {IMAGE_SIZE_LIMIT, VIDEO_SIZE_LIMIT} = require('./config')

const errorConstants = {
    ERR_NOT_AUTHORIZED: {
        errorCode: 403,
        error: 'Access Denied. You are not authorized to make this request.',
    },
    ERR_NOT_FOUND: {
        errorCode: 404,
        error: 'The requested entity was not found on the server.',
    },
    ERR_UNPROCESSABLE_ENTITIY: {
        errorCode: 422,
        error: 'Your Request cannot be processed.',
    },
    ERR_VIDEO_NOT_ALLOWED: {
        errorCode: 400,
        error: 'Videos are not allowed in this request.',
    },
    ERR_IMAGE_SIZE_EXCEEDED: {
        errorCode: 422,
        error: `Image upload size exceeded. Maximum upload size is ${Math.round(IMAGE_SIZE_LIMIT/1024/1024)} MB per Image.`,
    },
    ERR_VIDEO_SIZE_EXCEEDED: {
        errorCode: 422,
        error: `Video upload size exceeded. Maximum upload size is ${Math.round(VIDEO_SIZE_LIMIT/1024/1024)} MB per Video.`,
    },
    ERR_MEDIA_TYPE_NOT_ALLOWED: {
        errorCode: 422,
        error: 'Media Type not supported in this request',
    },
}

const transactionConstants = {
    INCOMING : "Incoming",
    OUTGOING : "Outgoing"
}

module.exports = {
    errorConstants,
    transactionConstants
}