const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError");
const Listing = require("./models/listing");
const Review = require("./models/review");
const {listingSchema, reviewSchema} = require("./schema.js");

module.exports.validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg)
    }
    next();
};

module.exports.validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg)
    }
    next();
};

module.exports.isLoggedIn = ((req, res, next)=>{
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
});

module.exports.saveRedirectUrl = ((req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
});

module.exports.validateObjectId = ((req, res, next)=>{
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ExpressError(400, "Invalid listing ID format.");
    }
    next();
});

module.exports.isOwner = (async(req, res, next)=>{
    const {id} = req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have the permission!");
        return res.redirect(`/listings/${id}`);
    }
    next();
});

module.exports.isReviewAuthor = (async(req, res, next)=>{
    const {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have the permission!");
        return res.redirect(`/listings/${id}`);
    }
    next();
});
