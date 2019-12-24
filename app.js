var cors = require('cors');

var express = require('express');
var app = express();
app.use(cors());
app.use(express.json());
pry = require('pry')
app.use(express.urlencoded({ extended: true }));
var User = require('./model/user');
var generator = require('generate-password');

const mongoose = require('mongoose');

mongoose
.connect('mongodb://localhost/dbtest',{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

app.post('/login', (req, res) => {
	console.log(req.body)
	User.findOne({email: req.body.email,password:req.body.password},(err,data)=>{
		if(err){ res.send(err); }
		if(data) {				
			var token = generator.generate({ length: 25, numbers: true	});
			User.findByIdAndUpdate(data._id, {authtoken:token}, function(err,user){
				if(err) { res.send(err);}
				res.send({user,"status":200});
			});
		}
		if(!data){
			user = "Email Password Wrong"
			res.send({user,"status":404})
		}
	});
});

app.get("/logout",(req,res)=>{
	User.findOne({authtoken:req.body.token},(err,data) => {
		if(err) { res.send(err); }
		if(data) {				
			User.findByIdAndUpdate(data._id, {authtoken:"token"}, function(err,user){
				if(err) { res.send(err);}
				res.send("Log Out");
			});
		}
		if(!data){ res.send("PLz log in") }
	})
})

app.listen(3000,()=>{
	console.log("server started")
});



