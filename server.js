const _        = require('lodash');
const NODE_ENV = process.env.NODE_ENV;
const NODE_ROUTER = process.env.NODE_ROUTER;

if (_.isUndefined(NODE_ENV)) {
    console.log('请先指定环境变量,NODE_ENV,值为 dev || pro');
    return process.exit(1);
}
let settings          = require(`./conf/${NODE_ENV}/settings`);
const http              = require('http');
const express           = require('express');
const bodyParser        = require('body-parser');
const connectMultiparty = require('connect-multiparty');
const cors              = require('cors');
const cookieParser      = require('cookie-parser');
const moment            = require('moment');
const app               = express();

global.appSettings = settings
global.BaseDir = __dirname;

var adaro = require('adaro');
const Router            = require('./routers/router');
const httpServer        = http.createServer(app);
const path              = require('path');
app.use(cookieParser('hyb_szm_sec'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: "20480kb"}));
app.use(connectMultiparty());
app.use(cors());

const options = {
    helpers: [
      function (dust) { dust.helpers.myHelper = function (a, b, c, d) {} },
      'dustjs-helpers',   //So do installed modules
    ],
    'cache': false
  };


app.engine('dust', adaro.dust(options));
app.engine('html',require('ejs-mate'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dust');
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', Router);

process.on('uncaughtException', function (err) {
    // handle the error safely
    console.log("uncaught error:", err);
});

const time = moment().format('YYYY-MM-DD HH:mm');
httpServer.listen(settings.port, function () {
    console.log('HTTP server listening on %d pid', settings.port, process.pid, time);
});


//err middleware
app.use(function (err, req, res, next) {
    console.log('Error2222 happened!! ', err);
    const statusCode = err.statusCode || 500;
    delete err.statusCode;
    console.log(err)
    res.status(statusCode).json({"message":err.message,"stack":err.stack});
});
console.log('-------------载入配置信息start-----------');
console.log('当前环境是: NODE_ENV = ', NODE_ENV);
console.log('当前环境是: NODE_ROUTER = ', process.env.NODE_ROUTER);
console.log(`配置文件: ${NODE_ENV}/settings.js,被载入`);
console.log('-------------载入配置信息end ------------');

module.exports = app;