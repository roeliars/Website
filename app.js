/*
Pao 1. En consola
mkdir ejemploForm
cd ejemploForm
npm init
npm i body-parser
npm i express
npm i geoip-lite
npm i mobile-locator
npm i sqlite3
node app.js
*/

//Edit1

/*
Paso 2. Editar archivo app.js
*/

// Copiar chinook.db en el folder de mi app
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

// Prueba de IP-Lookup:
var geoip = require('geoip-lite')
var ip = "142.251.34.196"
var geo = geoip.lookup(ip);
console.log(geo);

//Con opencellid
const api = require('mobile-locator');
 
const locate = api('opencellid', { key:"pk.721180d52d419781eb156ca699098798" });
 
locate({ mcc: 460, mnc: 0, lac: 4219, cid: 20925 })
  .then(location => console.log(JSON.stringify(location, null, 2)));

// sqlite3. OPEN_READONLY
// sqlite3. OPEN_READWRITE
// sqlite3. OPEN_CREATE
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});

let db = new sqlite3.Database('./sqlite.db',sqlite3. OPEN_READWRITE ,(err) => {
    if(err){
        console.error(err.message);
    }
    console.log('Conected to database!');
})

// Multiples puntos de acceso a mi sitio despues de la /
app.get('/', (req,res) => {
    res.sendFile(__dirname + '/htlms/index.html')
});

app.post('/signup', (req,res) => {
    res.sendFile(__dirname + '/htlms/signup.html')
});

app.post('/login', (req,res) => {
    res.sendFile(__dirname + '/htlms/login.html')
});


//post / register
// solo el open va afuera

app.post("/signupAction", urlencodedParser, (req, res) => {
    console.log('Body: ', req.body);
    console.log('Usuario', req.body.user);
    /*
    var errors=[]
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (!req.body.user){
        errors.push("No email specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    
    var data = {
        user: req.body.user, 
        password : req.body.password
    }
    */
    var sql ='INSERT INTO identifier (user, password) VALUES (?,?)'
    var params =[req.body.user, req.body.password]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.sendFile(__dirname + '/htlms/login.html')
    });

});

app.post('/auth', function(request, response) {
	// Capture the input fields
	let user = request.body.user;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
    var sql ='INSERT INTO identifier (user, password) VALUES (?,?)'
    var params =[req.body.user, req.body.password]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.sendFile(__dirname + '/htlms/login.html')
    });



	if (user && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM identifier WHERE user = ? AND password = ?', [user, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = user;
				// Redirect to home page
				response.redirect('/home');
			} else {
				response.send('Incorrect User and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter User and Password!');
		response.end();
	}
});


app.post("/loginAction", urlencodedParser, (req, res) => {
    /*
    var errors=[]
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (!req.body.user){
        errors.push("No email specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    
    var data = {
        user: req.body.user, 
        password : req.body.password
    }
    */
    var sql ='SELECT * FROM identifier WHERE INTO identifier (user, password) VALUES (?,?)'
    var params =[req.body.user, req.body.password]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message" : "success",
            // "data": data,
            //"id" : this.lastID
        })
    });

});


//la ip de nuestro server
//en la del profe 192.168.8.111
// localhost 127.0.0.1
// 127.0.0.1:3030
app.listen(4321, "127.0.0.1")


/*
db.close((err)=>{ //Cerramos la base de datos
    if(err){
        console.error(err.message);
    }
    console.log('Database closed');
})
*/