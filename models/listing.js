const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./Review.js");
const { CATEGORIES, TAX_RATE } = require("../utils/constants");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    description: {
        type: String,
        trim: true,
        maxLength: 2000
    },
    image: {
        url: String,
        filename: String
    },
    price: {
        type: Number,
        min: 0
    },
    location: String,
    country: String,
    category: {
        type: String,
        enum: CATEGORIES,
        required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number]
        }
    }
}, { timestamps: true });

// Virtual for tax-inclusive price
listingSchema.virtual('priceWithTax').get(function() {
    if (!this.price) return 0;
    return Math.round(this.price * (1 + TAX_RATE));
});

// Geo JSON Index for geospatial queries
listingSchema.index({ geometry: '2dsphere' });

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;