const mongoose = require("mongoose");
const Listing = require("../models/listing");

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

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
        "User-Agent": "wanderlust-app"
      }
    });

    const data = await res.json();

    if (data.length > 0) {
      listing.geometry = {
        type: "Point",
        coordinates: [
          parseFloat(data[0].lon),
          parseFloat(data[0].lat)
        ]
      };

      await listing.save();
      console.log(`✔ Updated: ${listing.title}`);
    } else {
      console.log(`✖ No result for: ${listing.title}`);
    }
  }

  mongoose.connection.close();
}

addGeometry();
