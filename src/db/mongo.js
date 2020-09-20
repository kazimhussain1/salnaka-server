const mongoose = require('mongoose');

mongoose
    .connect(process.env.MONGOOSE_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        autoReconnect:true,
        reconnectInterval: 10000,
        reconnectTries: Number.MAX_VALUE,
        bufferMaxEntries: 0
    })
    .then(() => {
        console.log('connected to db');
    })
    .catch((err) => {
        console.log(err);
    });



module.exports = mongoose.Connection;
