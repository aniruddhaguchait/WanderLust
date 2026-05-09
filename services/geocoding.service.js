const getCoordinates = async (location, country) => {
    const place = `${location}, ${country}`;
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`;
        const response = await fetch(url, {
            headers: {
                "User-Agent": "WanderLust-App"
            }
        });
        const data = await response.json();

        if (data.length > 0) {
            return {
                type: "Point",
                coordinates: [
                    parseFloat(data[0].lon),
                    parseFloat(data[0].lat)
                ]
            };
        }
    } catch (err) {
        console.error("Geocoding failed:", err);
    }
    return null;
};

module.exports = { getCoordinates };
