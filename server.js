// server.js
// where your node app starts

// init project
var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// init sqlite db
var fs = require('fs');
var dbFile = './nyt.db';
var exists = fs.existsSync(dbFile);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);

app.get('/book/:isbn', function(req, res) {  
  db.all('SELECT * from books where isbn = ? limit 1', req.params.isbn, function(err, rows) {
    if (rows.length==0){
      res.render('404');
    }else{     
      var isbn = rows[0]['isbn'];
      var title = rows[0]['title'];
      var description = rows[0]['description'];
      var creator = rows[0]['creator'];
      var oclc = rows[0]['oclc'];
      var rank = rows[0]['rank'];
      var weeks = rows[0]['weeks'];
      var subject = rows[0]['subject'].split('|');
      var publisher = rows[0]['publisher'];
      var review = rows[0]['review'];
      var cover = rows[0]['cover'];
      var history = JSON.stringify(rows[0]['history']);
      var referer = req.headers.referer;

      res.render('book', {referer:referer, isbn:isbn,title:title,description:description,creator:creator,oclc:oclc,rank:rank,weeks:weeks,subject:subject,publisher:publisher,review:review,cover:cover,history:history});
    }
  });
});

app.get('/search', function(req, res) {  
  if (!req.query.searchin){
    req.query.searchin = 'title';
    req.query.searchval = 'DO A BLANK SEARCH';
  }
  
  if (req.query.searchin == 'all'){
    var sql = 'SELECT * from books where title like ? or subject like ? or creator like ?';
  }
  if (req.query.searchin == 'title'){
    var sql = 'SELECT * from books where title like ?';
  }
  if (req.query.searchin == 'subject'){
    var sql = 'SELECT * from books where subject like ?';
  }
  if (req.query.searchin == 'creator'){
    var sql = 'SELECT * from books where creator like ?';
  }
  if (req.query.orderby == 'title'){
    sql = sql + ' order by title asc';
  }
  if (req.query.orderby == 'rank'){
    sql = sql + ' order by rank asc';
  }
  if (req.query.orderby == 'weeks'){
    sql = sql + ' order by weeks desc';
  }
  
  sql = sql + ' LIMIT 100';
  
  db.all(sql, '%'+req.query.searchval+'%', function(err, rows) {
    console.log(sql);
    if (err){console.log(err);}
    var results = [];      
    rows.forEach((r)=>{
      r.subject = r.subject.split('|');
      results.push(r);
    });

    res.render('search', {results:results});
  });
  
  
});

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(req, res) {
  db.all('SELECT * FROM books ORDER BY RANDOM() LIMIT 10;', function(err, rows) {
      
      var counter = 0;
      var books4 = [];
      var books8 = [];
      var books10 = [];

      var isbn = null;
      var title = null;
      var description = null;
      var creator = null;
      var oclc = null;
      var rank = null;
      var weeks = null;
      var subject = null;
      var publisher = null;
      var review = null;
      var cover = null;
      var history = null;
    
      // rows.forEach((row)=>{

        var isbn = rows[0]['isbn'];
        var title = rows[0]['title'];
        var description = rows[0]['description'];
        var creator = rows[0]['creator'];
        var oclc = rows[0]['oclc'];
        var rank = rows[0]['rank'];
        var weeks = rows[0]['weeks'];
        var subject = rows[0]['subject'].split('|');
        var publisher = rows[0]['publisher'];
        var review = rows[0]['review'];
        var cover = rows[0]['cover'];
        var history = JSON.stringify(rows[0]['history']);
    
        var isbn2 = rows[2]['isbn'];
        var title2 = rows[2]['title'];
        var description2 = rows[2]['description'];
        var creator2 = rows[2]['creator'];
        var oclc2 = rows[2]['oclc'];
        var rank2 = rows[2]['rank'];
        var weeks2 = rows[2]['weeks'];
        var subject2 = rows[2]['subject'].split('|');
        var publisher2 = rows[2]['publisher'];
        var review2 = rows[2]['review'];
        var cover2 = rows[2]['cover'];
        var history2 = JSON.stringify(rows[2]['history']);
        
        var isbn3 = rows[3]['isbn'];
        var title3 = rows[3]['title'];
        var description3 = rows[3]['description'];
        var creator3 = rows[3]['creator'];
        var oclc3 = rows[3]['oclc'];
        var rank3 = rows[3]['rank'];
        var weeks3 = rows[3]['weeks'];
        var subject3 = rows[3]['subject'].split('|');
        var publisher3 = rows[3]['publisher'];
        var review3 = rows[3]['review'];
        var cover3 = rows[3]['cover'];
        var history3 = JSON.stringify(rows[3]['history']);
        
  


      res.render('index', {
        isbn:isbn,title:title,description:description,creator:creator,oclc:oclc,rank:rank,weeks:weeks,subject:subject,publisher:publisher,review:review,cover:cover,history:history,
        isbn2:isbn2,title2:title2,description2:description2,creator2:creator2,oclc2:oclc2,rank2:rank2,weeks2:weeks2,subject2:subject2,publisher2:publisher2,review2:review2,cover2:cover2,history2:history2,
        isbn3:isbn3,title3:title3,description3:description3,creator3:creator3,oclc3:oclc3,rank3:rank3,weeks3:weeks3,subject3:subject3,publisher3:publisher3,review3:review3,cover3:cover3,history3:history3
      });
    
    
  });  
});






app.get('/relatedsubject/:search', function(req, res) {
  var sql = 'SELECT * from books where subject like ?';
  db.all(sql, '%'+req.params.search+'%', function(err, rows) {
    res.send(JSON.stringify(rows));
  });
});

app.get('/relatedcreator/:search', function(req, res) {
  var sql = 'SELECT * from books where creator like ?';
  db.all(sql, '%'+req.params.search+'%', function(err, rows) {
    res.send(JSON.stringify(rows));
  });
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
