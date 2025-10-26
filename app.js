const express= require("express");
const app= express();
const port= 3000;
const mongoose= require("mongoose");
const Listing= require("./models/listing.js");
const path= require("path");
const ejsMate= require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");
const methodOverride = require("method-override");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err)
    });
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

app.get("/",(req,res)=>{
    res.send("Home Page");
});

const validateListing = (req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
}

//INDEX ROUTE
app.get("/listings", wrapAsync(async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("./listings/index.ejs",{allListings})
}));

//NEW ROUTE
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//SHOW ROUTE
app.get("/listings/:id", wrapAsync(async(req,res)=>{
    let {id}=req.params;
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     throw new ExpressError(400, "Invalid listing ID format.");
    // }
    const listing= await Listing.findById(id);
    // if (!listing) {
    //     throw new ExpressError(404, "Listing not found.");
    // }
    res.render("./listings/show.ejs",{listing});
})); 

//CREATE ROUTE
app.post("/listings",validateListing, wrapAsync(async (req,res,next)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//EDIT ROUTE
app.get("/listings/:id/edit", wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
}));

//UPDATE ROUTE
app.put("/listings/:id", validateListing, wrapAsync(async(req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data for listing.");
    // };
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//DELETE ROUTE
app.delete("/listings/:id", wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

// app.get("/testlisting",async(req,res)=>{
//     let sampleListing=new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Goa",
//         country: "India"
//     });
//     await sampleListing.save();
//     console.log(sampleListing);
//     res.send("successful")
// });

//Invalid Routes
app.use((req,res,next)=>{
    next(new ExpressError(404, "Page not found!"))
});

app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something went wrong"}=err;
    res.status(statusCode).render("error",{message});
});

app.listen(port,()=>{
    console.log(`server is listening on ${port}`);
});