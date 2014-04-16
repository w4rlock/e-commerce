var express = require('express')
  , jwt = require('jsonwebtoken')
  , auth = require('express-jwt')
  , compress = require('compression')()
  , http = require('http')
  , validator = require('express-validator')
  , cron = require('cron').CronJob
  , path = require('path')
  , favicon = require('favicon')
  , app = express()
  , config = require('./config').init(app)
  , db = require('monk')(config.DB_URL)
  , mail = require('./lib/mail')
  , users = require('./lib/users');

mail.init(config);

var secret = "4$4bmQH23+$IFTRMv34R5seffeceE0EmC8YQ4o$";

//app.use(express.logger('dev'));
//app.use(express.methodOverride());
app.use(compress);
app.use('/api', auth({secret: secret }));
app.use(require('body-parser')())
//app.use(express.json());
//app.use(express.urlencoded());
app.use(validator());
//app.use(express.responseTime());
//app.use(express.compress());
//app.use(connect.favicon());
//app.use(express.favicon("public/favicon.ico"));
app.use('/public', express.static(path.join(__dirname, 'public')));

//app.use(favicon(__dirname + '/public/favicon.ico'));

//-- ROUTES
app.get('/', function(req, res){ res.send(app.routes); });
app.post('/login', users.authenticate(db, secret, jwt)); 
app.post('/signup',  users.signup(db, mail)); //DONE 
app.post('/api/profile', users.update(db));

app.get('/confirm/email/:token', users.confirmEmail(db));  //DONE 
app.all('*', function(req, res){ res.send({ err: 'Route not found'}, 404);});

http.createServer(app).listen(config.APP_PORT, 
  function() {
    console.log("\n[*] Server Listening on port %d", config.APP_PORT); 
  }
);

//Seconds: 0-59, Minutes: 0-59, Hours: 0-23, Day of Month: 1-31, Months: 0-11, Day of Week: 0-6
//new cron('30 02 21 * * 5', 
  //function(){
    //console.log('[*] Cron job started');
    //console.log('[*] Actualizando Aseguradoras (WebService)');
    //ars.updateAseguradoras(ws,db);
  //}, 
//null, true);
