if (process.env.NODE_ENV != "production") {
    require("dotenv").config({ path: "../.env" });
}

const mongoose = require("mongoose");
const Listing = require("../models/listing");

const MONGO_URL = process.env.ATLAS_DB_URL;

mongoose.connect(MONGO_URL);

async function addGeometry() {
  const listings = await Listing.find({
    $or: [
      { geometry: { $exists: false } },
      { geometry: null }
    ]
  });

  console.log(`Found ${listings.length} listings without geometry`);

  for (let listing of listings) {
    if (!listing.location) continue;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      listing.location
    )}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Wanderlust App - contact: aniruddhaguchait13@gmail.com",
        "Accept": "application/json"
      }
    });

    const data = await res.json();

    if (data.length > 0 ) {
      listing.geometry = {
        type: "Point",
        coordinates: [
          parseFloat(data[0].lon),
          parseFloat(data[0].lat)
        ]
      };

      try {
        await listing.save();
        console.log(`✔ Updated: ${listing.title}`);
      } catch (err) {
        console.log("Save failed for:", listing.title);
        console.log(err.message);
      }
    }
  }

  mongoose.connection.close();
}

addGeometry();
