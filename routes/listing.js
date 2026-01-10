const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {
    isLoggedIn,
    validateObjectId,
    isOwner,
    validateListing
} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing)
    );

router.get("/new",
    isLoggedIn,
    listingController.renderNewForm
);

router.route("/:id")
    .get(
        validateObjectId,
        wrapAsync(listingController.showListing)
    )
    .put(
        isLoggedIn,
        validateObjectId,
        isOwner,
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        validateObjectId,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );

router.get("/:id/edit",
    isLoggedIn,
    validateObjectId,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);


module.exports = router;