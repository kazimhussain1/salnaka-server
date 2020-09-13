require("dotenv").config();
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db/mongo");
const api = require("./routes");
const { join } = require("path");
const cors = require('cors')
const cronJob = require('cron').CronJob;
const expressFormidable = require("express-formidable");
const profit = require("./repositories/transaction.repo");

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
console.log(join(__dirname, "../", "public/"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
// app.use(expressFormidable()); use formidable instead of express-formidable
// app.use(multer().array());
app.use(cors())
app.use("/", express.static(join(__dirname, "../", "public/")));
app.use("/api", api);

let profitJob = new cronJob('0 0 17 * * *', () => profit.profit());
profitJob.start();

server.listen(PORT, () => console.log(`server running on port ${PORT}`));
