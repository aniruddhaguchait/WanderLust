if (listing.geometry) {
  const [lng, lat] = listing.geometry.coordinates;

  const street = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { 
      attribution:
        '© OpenStreetMap contributors', 
      maxZoom: 19,
    }
  );

  const satellite = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/' +
    'World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
      attribution:
        'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics',
      maxZoom: 19,
    }
  );

  const map = L.map('map', {
    center: [lat, lng],
    zoom: 15,
    scrollWheelZoom: false,
    layers: [street],
  });

  const baseMaps = {
    "Street": street,
    "Satellite": satellite,
  };

  L.control.layers(baseMaps, null, { position: 'topright' }).addTo(map);

  
   // Custom red marker (#fe424d)
  const heartMarker = L.divIcon({
    className: 'custom-marker',
    html: `<span class="material-symbols-outlined"
            style="
            font-size: 42px;
            color: #fe424d;
            line-height: 1;
          ">
            map_pin_heart
          </span>
  `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });

  L.marker([lat, lng], { icon: heartMarker })
    .addTo(map)
    .bindPopup(`
      <div style="text-align:center">
        <h5 style="color:#fe424d; font-size:16px; ">
          ${listing.title}
        </h5>
        <p>
          📍 Exact location will be shared after booking
        </p>
      </div>
    `)
    .openPopup();
};