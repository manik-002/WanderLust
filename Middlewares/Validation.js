const Joi = require('joi');

const ListingValidation = (req, res, next) => {
    const schema = Joi.object({
        Title: Joi.string().min(3).max(100).required(),
        Description: Joi.string().min(3).max(500).required(),
        Image: Joi.string().allow('', null), 
        Price: Joi.number().required().min(0),
        Location: Joi.string().required(),
        Country: Joi.string().max(100).required(),
    });
    
    const { error } = schema.validate(req.body);
    
    if (error) {
        return res.status(400).json({
            message: "Bad request",
            error: error.details.map(err => err.message) 
        });
    }
    
    next();
};

const ReviewValidation = (req,res,next) =>{
    const schema = Joi.object({
        rating : Joi.number().min(0).max(5).required(),
        comments : Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: "Bad request",
            error: error.details.map(err => err.message) 
        });
    }
    
    next();

};

module.exports = {
    ListingValidation,
    ReviewValidation
};





// const ListingValidation = (req, res, next) => {
//     const schema = Joi.object({
//         Title: Joi.string().min(3).max(100).required(),
//         Description: Joi.string().min(3).max(500).required(),
//         Price: Joi.number().min(0).required(),
//         Location: Joi.string().required(),
//         Country: Joi.string().max(100).required(),
//     });

//     const { error } = schema.validate(req.body);

//     // Validate the file upload
//     if (!req.file) {
//         return res.status(400).json({
//             message: "Bad request",
//             error: "Image file is required."
//         });
//     }

//     if (error) {
//         return res.status(400).json({
//             message: "Bad request",
//             error: error.details.map(err => err.message)
//         });
//     }

//     next();
// };

