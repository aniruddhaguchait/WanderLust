const Listing = require("../models/listing.js");


module.exports.index = async(req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews", 
        populate: {
            path: "author",
        }
    }).populate("owner");
    
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    };
    res.render("./listings/show.ejs", {listing});
};

module.exports.createListing = async(req, res)=>{
    const { location, country } = req.body.listing;
    const place = `${location}, ${country}`;

    let geometry = null;

    try {
        const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`,
            {
                headers: {
                    "User-Agent": "WanderLust-App"
                }
            }
        );
        const geoData = await geoRes.json();

        if (geoData.length > 0) {
            geometry = {
                type: "Point",
                coordinates: [
                parseFloat(geoData[0].lon),
                parseFloat(geoData[0].lat)
                ]
            };
        }
    } catch (err) {
        console.error("Geocoding failed:", err);
    }

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    if (geometry) newListing.geometry = geometry;

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    };

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_400,h_250,c_fill");
    res.render("./listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    listing.set(req.body.listing);

    if (req.body.listing.location) {
        const place = `${req.body.listing.location}, ${req.body.listing.country}`;

        try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`,
            {
                headers: {
                    "User-Agent": "WanderLust-App"
                }
            }
        );

        const data = await response.json();

        if (data.length > 0) {
            listing.geometry = {
            type: "Point",
            coordinates: [
                parseFloat(data[0].lon),
                parseFloat(data[0].lat)
            ]
            };
        }
        } catch (err) {
            console.error("Geocoding failed:", err);
            req.flash("error", "Location could not be updated on map");
        }
    }

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename};
    };
    
    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);

    if(!deletedListing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    };

    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};