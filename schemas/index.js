const joi = require('joi');
const { CATEGORIES } = require('../utils/constants');

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required().max(100),
        description: joi.string().required().max(2000),
        image: joi.object({
            url: joi.string().allow("", null),
            filename: joi.string().allow("", null)
        }).allow(null),
        price: joi.number().required().min(0),
        location: joi.string().required(),
        country: joi.string().required(),
        category: joi.string().valid(...CATEGORIES).required()
    }).required()
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required()
    }).required()
});
