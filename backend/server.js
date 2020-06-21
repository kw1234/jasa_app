var express    = require("express");
var login = require('./routes/loginroutes');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
    });
var api = express.Router();

//test route
api.get('/', function(req, res) {
	res.json({message: "welcome to hell"});
    });


//route to handle user registration                                                                                                                                                                           
api.post('/register', login.register);
api.post('/login', login.login);
app.use('/api', api);

app.listen(3000);