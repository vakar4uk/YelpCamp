var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
    
// INDEX - Show all campgrounds
router.get("/", function(req, res) {
    // Get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
    
    // res.render("/", {campgrounds: campgrounds});
});

router.post("/", middleware.isLoggedIn,function(req, res) {
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   var price = req.body.price;
   var author = {
       id: req.user._id,
       username: req.user.username
   }
   var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    //   Create a new campground and save to database
    Campground.create(newCampground, function(err, newlyCreated){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
   
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new"); 
});

// SHOW Route
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            // render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
    var campID = req.params.id;
});

// EDIT campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            res.render("campgrounds/edit", {campground: foundCampground});
        });
});
// UPDATE campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    // find an update correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
       if(err) {
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds");
       }
    });
});

module.exports = router;