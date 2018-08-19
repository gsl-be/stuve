var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql'); 
var formidable = require('formidable'); 
var http = require('http');
var fs = require('fs');

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
  res.sendFile('index.html', {root: viewfolder});
});

 

app.post('/fileupload',function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.uploadIMG.path;
      var newpath = 'C:/Users/Kyara/Documents/MIT GSL/MoveWebsite/stuve/public/uploaded_pictures/' + files.uploadIMG.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        //res.end();
      });
 });
  
})


app.get('/load/:key', function(req, res, next) {
  db.all('SELECT * FROM vente WHERE souscat = ?', [req.params.key], function(err,rows) {
    if (err) {
      return console.log(err.message);
    }
    var i =0;
    var row_size = 4;
    var ret = "";
    var counter = 0;
    for(i = 0;i<rows.length;i++){
          ret = ret + '<div class="row">'
          var j;
          for(j=0;j<row_size;j++){
            if(counter<rows.length){
              ret = ret + '<div class="column" title="' + rows[counter].descr + '"><div class="container2"><img src="' + 'uploaded_pictures/' + rows[counter].img.split('|')[0]
              ret = ret + '"><div class="bottom-right2">'+rows[counter].prix+' </div><div class="overlay">Etat: '+ rows[counter].etat
                  + '</div></div></div>'
              counter++
              }
          }
          ret = ret + '</div>'
    }
    res.send(ret)
  });
} );

app.get('/getID/:key', function(req, res, next) {
    var nextId = getNextId();
    var resu = ""
    var i = 0
    console.log(req.params.key)
    for(i=0;i<req.params.key;i++){
        resu = resu + nextId + "|"
        nextId++
    }
    setNextId(nextId)
    console.log("Setting nextId to " + nextId)
    res.send(resu.substring(0,resu.length-1))
} );

app.get('/fri', function(req, res, next) {
  res.sendFile('friteuse.html', {root: viewfolder})
} );

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
        /*db.all("SELECT * FROM users", [], (err, rows) => {
          if (err) {
            throw err;
          }
          rows.forEach((row) => {
            console.log(row);
          });
        });*/
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
  img = req.query["imgName"]
  db.run(`INSERT INTO vente(cat,souscat,marque,couleur,etat,matiere,age,dim,prix,descr,img) VALUES(?,?,?,?,?,?,?,?,?,?,?)`, [cat,souscat,marque,color,etat,matiere,age,dim,price,descr,img], function(err) {
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

app.get('/getDB', function(req,res,next){
  console.log("GET DB")
  db.all("SELECT * FROM vente", [], (err, rows) => {
  if (err) {
    throw err;
  }
  console.log(rows)
  rows.forEach((row) => {
    console.log(row);
  });
});
 res.send("see console")
})

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
db.run('CREATE TABLE IF NOT EXISTS vente(cat text,souscat text,marque text,couleur text,etat text,matiere text,age text,dim text,prix text,descr text, img text)');
db.run('CREATE TABLE IF NOT EXISTS Nimg(n text)');
/*db.run(`INSERT INTO Nimg(n) VALUES(?)`, [0], function(err) {
  if (err) {
      return console.log(err.message);
  }
});*/

function getNextId(){
  console.log("in get next ID")
  var ret = 0;
  db.all('SELECT max(n) m FROM Nimg', function(err,rows) {
    if (err) {
      return console.log(err.message);
    }
    console.log("rows in getNextId:")
      console.log(rows)
    // get the last insert id
    if(rows.length==0){
      console.log("no row")
      ret = ret + 0;
      return 0;
    }else{
      console.log(rows[0].m)
      ret = ret + rows[0].m;
      return rows[0].m;
      }
  });
  //console.log("NEXT ID")
  //console.log(ret)
  //console.log("out get next ID")
  //return ret;
}

function setNextId(id_to_insert){
  console.log("in set next ID")
  //db.run('DELETE FROM Nimg')
  db.all('SELECT * FROM Nimg', function(err,rows) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log("rows:")
    console.log(rows)
  });
  db.run('INSERT INTO Nimg(n) VALUES (?)',[id_to_insert])
  db.all('SELECT * FROM Nimg', function(err,rows) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log("rows:")
    console.log(rows)
  });
  console.log("out set next ID")
}

////////////////////////////start the server/////////////////////
var port=3000
app.listen(port, function(){
    console.log('App listening on port:' + port)
})