require("dotenv").config();
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db/mongo");
const api = require("./routes");
const { join } = require("path");
const cors = require('cors')

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
console.log(join(__dirname, "../", "public/"));


app.use(cors())
app.use("/", express.static(join(__dirname, "../", "public/")));
app.use(bodyParser.json());
app.use("/api", api);

server.listen(PORT, () => console.log(`server running on port ${PORT}`));
