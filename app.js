var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser=require('body-parser');
var dateFormat=require('dateformat');
var mysql=require('mysql');
var now =new Date();
var JSAlert = require("js-alert");
var dotenv = require('dotenv');
dotenv.config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var savedata = require('./routes/savedata');
var preview = require('./routes/preview');
var homepage=require('./routes/homepage');


var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var events = require('events');
var eventEmitter = new events.EventEmitter();

global.login=0;
//global.username="utkarsh";
global.uid=0;
//global.company="";
//global.companyname="";
global.dept="-1";
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/js',express.static(__dirname+'/node_modules/bootstrap/dist/js'));
app.use('/js',express.static(__dirname+'/node_modules/tether/dist/js'));
app.use('/js',express.static(__dirname+'/node_modules/jquery/dist'));
app.use('/css',express.static(__dirname+'/node_modules/bootstrap/dist/css'));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public/')));
app.use(bodyParser.urlencoded({extended:true}));


const con=mysql.createConnection({
	host:process.env.HOST,
	user:process.env.USER,
	password:process.env.PASSWORD,
	database:process.env.DATABASE
});


//app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/savedata',savedata);
//app.use('/preview',preview);
app.use('/',homepage);

app.get('/logs', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

eventEmitter.on('logging', function(message) {
  io.emit('log_message', message);
});

var originConsoleLog = console.log;
console.log = function(data) {
  eventEmitter.emit('logging', data);
  originConsoleLog(data);
};



app.get('/preview',function(req,res){
	
	con.query("select lat,lng,label,priority from locations where dept='"+dept+"'",function(err,result){
		res.render('preview',{ me: JSON.stringify(result)});
		//console.log(result);
	});
	
});

app.post('/selection',function(req,res){
	console.log(req.body.activity);
	con.query("select lat,lng,label,priority from locations where dept='"+req.body.activity+"'", function(err,result) {
		res.render('preview',{me:JSON.stringify(result)});
	});
});

app.post('/savedata',function(req,res){
//(latitude,longitude,address,priority,region,companyid)
	if(login==0){
		console.log("login to the app to use these features");
		res.redirect("http://localhost:3000");
}
		else{
		var query="insert into locations values ("+req.body.latitude+","+req.body.longitude+", '"+req.body.address+"','"+req.body.priority+"','"+dept+"')";
		con.query(query,function(err,result){
			res.redirect("http://localhost:3000/savedata");
		});}
});


app.post('/homepage',function(req,res){
	var uname=req.body.username;
	uid++;
	if(req.body.username=="" || req.body.email=="" || req.body.activity=="" || req.body.password=="" )
	{
		console.log("fields can't be empty");
		res.redirect("http://localhost:3000");
	}
	else{
	uname=uname[0]+uname[1]+uname[2]+uid;
		console.log("your userid is:");
		console.log(uname);	
		console.log(req.body.activity);	
	var q1="insert into logindetails values('"+req.body.username+"','"+uname+"','"+req.body.email+"','"+req.body.activity+"','"+req.body.password+"')";
	con.query(q1,function(err,result){
		//console.log(result);
		if(result.length!=0){
			console.log("data entered!");
		}
		else{
			console.log("couldn't enter data");
		}
		res.redirect("http://localhost:3000");
	});
}

});
app.post('/loginpage',function(req,res){
	console.log("connected");
	console.log(req.body.userid);
	console.log(req.query);
		var query="select * from logindetails where uid='"+req.body.userid+"' and password='"+req.body.password+"'";
	con.query(query,function(err,result){
				if(result.length==0){
					console.log("couldn't find login details");
						//res.redirect("http://localhost:3000");
				}
				else{
					console.log("login success");
					login=1;
					username=result[0].username;
					dept=result[0].dept;
					console.log(username);
					console.log(dept);
				}
				res.redirect("http://localhost:3000");
	});

});

app.use('/logout',function(req,res){
	login=0;
	res.redirect("http://localhost:3000");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000,function(){
	console.log("server started on 3000");
});