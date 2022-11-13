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
    res.sendFile(__dirname + '/htlms/index.html')
});

app.post('/main', (req,res) => {
    res.sendFile(__dirname + '/htlms/main.html')
});

//post / register
// solo el open va afuera

app.post("/signupAction", urlencodedParser, (req, res) => {
    console.log('Body: ', req.body);
    console.log('Usuario', req.body.user);

    var sql ='INSERT INTO identifier (user, password) VALUES (?,?)'
    var params =[req.body.user, req.body.password]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.sendFile(__dirname + '/htlms/index.html')
    });

});


app.post('/auth', urlencodedParser, function(req, res) {
	// Capture the input fields
	// Ensure the input fields exists and are not empty
		// Execute SQL query that'll select the account from the database based on the specified username and password
        var sql ='SELECT * FROM identifier WHERE user = ? AND password = ?'
        var params =[req.body.user, req.body.password]
        db.all(sql, params, function(err, rows) {
        // If there is an issue with the query, output the error
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }

			if (JSON.stringify(rows).length > 2) {
				// Redirect to home page
				res.sendFile(__dirname + '/htlms/main.html')
			} 	else {
                res.sendFile(__dirname + '/htlms/index.html')
                console.log("error")
            }

		});
});


/*
app.post("/loginAction", urlencodedParser, (req, res) => {

    var sql ='SELECT * FROM identifier WHERE user = ? AND password = ?'
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
*/

//la ip de nuestro server
//en la del profe 192.168.8.111
//en mi casa BMS 192.168.15.59
// localhost 127.0.0.1
// 127.0.0.1:3030

//app.set('port', process.env.PORT || 5000)
app.listen(process.env.PORT || 3000);


/*
db.close((err)=>{ //Cerramos la base de datos
    if(err){
        console.error(err.message);
    }
    console.log('Database closed');
})
*/