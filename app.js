var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql'); 

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
var viewfolder = path.join(__dirname, 'views')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
// Uncomment to external folders for routing
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

////////////////////////most of your code is in this section /////////

/* GET home page. */
app.get('/', function(req, res, next) {
   let sql = `SELECT * FROM users
           ORDER BY prenom`;
 
  db.all(sql, [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(row);
  });
});
  res.sendFile('index.html', { root: viewfolder});
});

app.get('/signup', function(req, res, next) {
  prenom = req.query["prenom"]
  nom = req.query["nom"]
  email = req.query["mail"]
  password = req.query["psw"]
  year = req.query["annee"]
  db.all('SELECT COUNT(*) count FROM users WHERE email=? AND password=?',[email,password], function(err,rows) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    if(rows[0].count==0){
      db.run(`INSERT INTO users(prenom,nom,email,password,year) VALUES(?,?,?,?,?)`, [prenom,nom,email,password,year], function(err) {
        if (err) {
          return console.log(err.message);
        }
        db.all("SELECT * FROM users", [], (err, rows) => {
          if (err) {
            throw err;
          }
          rows.forEach((row) => {
            console.log(row);
          });
        });
      });
    }else{
        res.sendFile('index.html', { root: viewfolder,errorMail:true})
    }
  res.sendFile('index.html', { root: viewfolder})
 });
});

app.get('/poster_annonce', function(req, res, next) {
  cat = req.query["categories"]
  souscatMob = req.query["souscategoriesMob"]
  souscatElec = req.query["souscategoriesElec"]
  souscatVaiss = req.query["souscategoriesVaiss"]
  souscatLampe = req.query["souscategoriesLampe"]
  var souscat;
  if(cat=="mobilier"){
    souscat = souscatMob;
  }else if(cat=="electronics"){
    souscat = souscatElec;
  }else if(cat=="vaisselle"){
    souscat = souscatVaiss;
  }else{
    souscat = souscatLampe;
  }
  marque = req.query["marq"]
  color = req.query["color"]
  etat = req.query["etat"]
  matiere = req.query["matiere"]
  age = req.query["age"]
  dim = req.query["dim"]
  price = req.query["price"]
  descr = req.query["description"]
  db.run(`INSERT INTO vente(cat,souscat,marque,couleur,etat,matiere,age,dim,prix,descr) VALUES(?,?,?,?,?,?,?,?,?,?)`, [cat,souscat,marque,color,etat,matiere,age,dim,price,descr], function(err) {
  if (err) {
      return console.log(err.message);
  }
   db.all("SELECT * FROM vente", [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(row);
  });
});
  });
  res.sendFile('index.html', { root: viewfolder})
 });

app.get('/login', function(req, res, next) {
  email = req.query["mail"]
  password = req.query["psw"]
  db.all('SELECT COUNT(*) count FROM users WHERE email=? AND password=?',[email,password], function(err,rows) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    if(rows[0].count==0){
    	console.log("not found")
    }
  });
  res.sendFile('index.html', { root: viewfolder})
 });

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('mydb');


db.run('CREATE TABLE IF NOT EXISTS users(prenom text,nom text,email text,password text,year text)');
db.run('CREATE TABLE IF NOT EXISTS vente(cat text,souscat text,marque text,couleur text,etat text,matiere text,age text,dim text,prix text,descr text)');

////////////////////////////start the server/////////////////////
var port=3000
app.listen(port, function(){
    console.log('App listening on port:' + port)
})