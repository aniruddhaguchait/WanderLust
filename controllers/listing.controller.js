const Listing = require("../models/Listing");
const { getCoordinates } = require("../services/geocoding.service");
const { PAGINATION_LIMIT } = require("../utils/constants");

module.exports.index = async (req, res) => {
    const { q, category, page = 1 } = req.query;
    let query = {};

    // Search query
    if (q) {
        const searchRegex = new RegExp(q, 'i');
        query.$or = [
            { title: searchRegex },
            { location: searchRegex },
            { country: searchRegex }
        ];
    }

    // Category filter
    if (category) {
        query.category = category;
    }

    const limit = PAGINATION_LIMIT;
    const skip = (page - 1) * limit;

    const allListings = await Listing.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    const totalListings = await Listing.countDocuments(query);
    const totalPages = Math.ceil(totalListings / limit);

    res.render("listings/index.ejs", { 
        allListings, 
        q, 
        category, 
        currentPage: parseInt(page), 
        totalPages 
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            }
        }).populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
    const { location, country } = req.body.listing;
    
    // Geocoding
    const geometry = await getCoordinates(location, country);

    let url = req.file ? req.file.path : "";
    let filename = req.file ? req.file.filename : "";
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    
    if (geometry) newListing.geometry = geometry;

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url || "";
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_400,h_250,c_fill");
    
    res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    listing.set(req.body.listing);

    // Update location coordinates if location/country changed
    if (req.body.listing.location || req.body.listing.country) {
        const geometry = await getCoordinates(
            req.body.listing.location || listing.location, 
            req.body.listing.country || listing.country
        );
        if (geometry) listing.geometry = geometry;
    }

    // Update image if new one provided
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }

    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};
