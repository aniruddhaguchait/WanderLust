const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


//POST REVIEWS
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);

//DELETE REVIEWS
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);


module.exports = router;