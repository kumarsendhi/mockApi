const express = require('express')
const mongoose = require('mongoose');
const app = express()

app.use(express.static(__dirname+"/public"));

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/restConfig',{
  useMongoClient: true
});

const restSchema= require('./public/models/restSchema')

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()


app.get('/users',function(req,res){
    console.log("I received a Get request");
    var promise = restSchema.find({});
    promise.then(successCallback, errorCallback);
    function successCallback(docs){
        console.log(docs)
         res.json(docs);
    }
    function errorCallback(error){
      res.status(err.status || 500);
      res.render('error', {
      message: err.message,
      error: err
    });
    }
  })


  app.delete('/users/:id', function (req, res) {
		var id = req.params.id;
		console.log(id);
    var promise = restSchema.remove({ _id: req.params.id }, function (err, docs) {
			if (err) { console.log("Error removing Area") }
			console.log(docs);
			res.json(docs);
		});
})


app.get('/users/:id', function (req, res) {
		var id = req.params.id;
		console.log(id);
    restSchema.findOne({ _id: req.params.id }).exec(function (err, docs) {
        if (err) { console.log("Error getting particular area") }
        console.log("Result:" + docs);
        res.json(docs);
    })
})


app.put('/users/:id', jsonParser, function (req, res) {
		
		var id = req.params.id;
		console.log(req.body);
    restSchema.findById(req.params.id, function (err, doc) {
			if (err) {
				console.log("Error getting document");
				return;
			}
			console.log("found for update" + doc);
			doc.url = req.body.url;
			doc.method = req.body.method;
			doc.authorization = req.body.authorization;
			doc.headers = req.body.headers;
			doc.restbody = req.body.restbody;
      doc.response = req.body.response;

			doc.save(function (err, docs) {
				if (err) {
					console.log(err);
				}
				else {
					res.json(docs);
				}
			})


		})

})


app.post('/users',jsonParser,function(req,res){
   console.log(req.body);
    var rest = new restSchema(req.body);

    var promise = rest.save();

    promise.then(successCallback, errorCallback);

    function successCallback(docs){
        console.log(docs)
         res.json(docs);
        
    }
    function errorCallback(error){
      res.status(err.status || 500);
      res.render('error', {
      message: err.message,
      error: err
    });
    }
})


app.get('*', function (req, res){
  	
    restSchema.find({url:req.url,method:req.method}, function (err, docs) {
			if (err) {
				console.log("Error getting document");
				return;
			}
			console.log("found for update" + docs);
			console.log(docs)
      res.json(docs[0].response);
		})
});


app.put('*', jsonParser, function (req, res) {	
  app.use(bodyParser.json());
    restSchema.find({url:req.url,method:req.method,restbody:JSON.stringify(req.body)}, function (err, docs) {
			if (err) {
				console.log("Error getting document");
				return;
			}
		console.log("found for update" + docs);
		console.log(docs)
    if(docs.length === 1)
    res.json(docs[0].response);
    else
    res.status(404).send("Sorry can't find that!")
		})

})


app.post('*', jsonParser, function (req, res) {	
  app.use(bodyParser.json());
    restSchema.find({url:req.url,method:req.method,restbody:JSON.stringify(req.body)}, function (err, docs) {
			if (err) {
				console.log("Error getting document");
				return;
			}
		console.log("found for update" + docs);
		console.log(docs)
    if(docs.length === 1)
    res.json(docs[0].response);
    else
    res.status(404).send("Sorry can't find that!")
		})

})



app.delete('*', jsonParser, function (req, res) {	
  app.use(bodyParser.json());
    restSchema.find({url:req.url,method:req.method,restbody:JSON.stringify(req.body)}, function (err, docs) {
			if (err) {
				console.log("Error getting document");
				return;
			}
		console.log("found for update" + docs);
		console.log(docs)
    if(docs.length === 1)
    res.json(docs[0].response);
    else
    res.status(404).send("Sorry can't find that!")
		})

})




app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
