const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, validateObjectId, isOwner, validateListing } = require("../middleware");
const listingController = require("../controllers/listing.controller");
const { upload } = require("../config/cloudinary");

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing)
    );

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(validateObjectId, wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        validateObjectId,
        isOwner,
        upload.single('listing[image]'),
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
