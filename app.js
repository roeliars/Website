/*
Pao 1. En consola
mkdir ejemploForm
cd ejemploForm
npm init
npm i body-parser
npm i express
*/

/*
Paso 2. Editar archivo app.js
*/

/*
npm init
npm i body-parser
npm i express
npm i sqlite3
node app.js
*/

// Copiar chinook.db en el folder de mi app
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

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
        res.json({
            "message" : "success",
            // "data": data,
            //"id" : this.lastID
        })
    });

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
app.listen(3030, "127.0.0.1")

/*
db.close((err) => {
    if(err){
        console.error(err.message);
    }
    console.log('Database closed')
});
*/