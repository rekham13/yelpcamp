var express =require("express");
 var   app=express();
 var   bodyParser=require("body-parser");
var mongoose=require("mongoose");
var flash=require("connect-flash");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var methodOverride=require("method-override");
var Campground=require("./models/campground");
var seedDB    = require("./seeds");
var User     = require("./models/user")
var Comment= require("./models/comment");

var commentRoutes=require("./routes/comments.js"),
	campgroundRoutes=require("./routes/campground.js"),
    indexRoutes =require("./routes/index.js")


//seedDB(); //seed database
mongoose
	.connect('mongodb+srv://saidarshan:R@mb02501@cluster0-wjhf4.mongodb.net/yelpcamp?retryWrites=true&w=majority', {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('Connected to DB');
	})
	.catch((err) => {
		console.log('ERROR', err.message);
	});
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(bodyParser.urlencoded({extended:true}));

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"CSGO is the best game",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	res.locals.currentUser=req.user;
	next();
})

//requiring routes
app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(process.env.PORT || 3000,process.env.IP,function(){
	console.log("Yelp Camp has started");
})