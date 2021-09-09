var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware")

//INDEX-shows all campgrounds
router.get("/",function(req,res){
	Campground.find({},function(err,allcampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds:allcampgrounds});
		}
	});
});

//Create-add new campground
router.post("/",middleware.isLoggedIn,function(req,res){
	var name=req.body.name;
	var image=req.body.image;
	var desc=req.body.description;
	var price=req.body.price
	 var author = {
        id: req.user._id,
        username: req.user.username
    }
	var newCampground={name:name,price:price,image:image,description:desc,author:author};
   
	Campground.create(newCampground,function(err,newlyCreated){
		if(err){
			console.log(err);
		}else{
			console.log(newlyCreated);
			 res.redirect("/campgrounds");
		}
	});
})

//NEW-show form to create new campground
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
})

//SHOW-shows details
router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			    res.render("campgrounds/show",{campground:foundCampground})
		}
	})
	});

//Edit route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
				res.render("campgrounds/edit",{campground:foundCampground});
		}
	})
})

//Update router
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	//find and update
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})

//Destroy route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			req.flash("success","Successfully deleted the campground");
			res.redirect("/campgrounds");
		}
	})
})







module.exports=router;