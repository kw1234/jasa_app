var mysql = require('mysql');
var bcrypt = require('bcrypt');

var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'password',
        database : 'mockUsers'
    });

connection.connect(function(err){
        if(!err) {
            console.log("Database is connected ... \n\n");
        } else {
            console.log(err);
            console.log("Error connecting to database ... \n\n");
        }
    });

exports.register = async function(req, res) {

    const password = req.body.password;
    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    var users = {
	"email": req.body.email,
	"password": encryptedPassword
    }

    connection.query('insert into users set ?', users, function(error, results, fields) {
	    if (error) {
		res.send({
			"code":400, "failed":"error occurred"
		    });
	    } else {
		res.send({
			"code": 200,
			"success": "user registered successfully"
		    });
	    }
	});
};

exports.login = async function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    connection.query('select * from users where email = ?', [email], async function(error, results, fields) {
	    if (error) {
		res.send({
			"code": 400,
			"failed": "error occurred"
		    });
	    } else {
		if (results.length > 0) {
		    const comparison = await bcrypt.compare(password, results[0].password);
		    if (comparison) {
			res.send({
				"code": 200,
				"success": "login successfull"
			    });
		    } else {
			res.send({
				"code": 204,
				"success": "Email and password do not match"
			    });
		    }
		} else {
		    res.send({
			    "code": 206,
			    "success": "Email does not exist"
			});
		}
	    }
	});
};