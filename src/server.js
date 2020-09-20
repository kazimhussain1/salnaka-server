require('dotenv').config();
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/mongo');
const api = require('./routes');
const { join } = require('path');
const cors = require('cors');
const cronJob = require('cron').CronJob;
const { addProfit } = require('./repositories/admin.wallet.repo');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
console.log(join(__dirname, '../', 'public/'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/public', express.static(join(__dirname, '../', 'public/')));
app.use('/api', api);

// addProfit(); Do not uncomment in production
let profitJob = new cronJob('0 0 17 * * *', () => addProfit());
profitJob.start();

server.listen(PORT, () => console.log(`server running on port ${PORT}`));
