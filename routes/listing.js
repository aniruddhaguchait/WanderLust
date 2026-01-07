const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateObjectId, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js")


//INDEX
router.get("/",
    wrapAsync(listingController.index)
);

//NEW
router.get("/new",
    isLoggedIn,
    listingController.renderNewForm
);

//SHOW
router.get("/:id",
    validateObjectId,
    wrapAsync(listingController.showListing)
); 

//CREATE
router.post("/",
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.createListing)
);

//EDIT
router.get("/:id/edit",
    isLoggedIn,
    validateObjectId,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);

//UPDATE
router.put("/:id",
    isLoggedIn,
    validateObjectId,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
);

//DELETE
router.delete("/:id",
    isLoggedIn,
    validateObjectId,
    isOwner,
    wrapAsync(listingController.destroyListing)
);


module.exports = router;