$(() => {
  var mymap = L.map("mapid").setView(
    [parseFloat(lat), parseFloat(lng)],
    parseFloat(zoomLvl)
  );

  mymap.locate({ maxZoom: 18 });
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: `mapbox/${basemap}`,
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "sk.eyJ1IjoiY2dtZW93IiwiYSI6ImNrdHEzdXZ5bDBzcTcyeG8zY3d2eDZtdWIifQ.E0aRLAKw0M-8RLA2DaxicQ",
    }
  ).addTo(mymap);

  // =========================

  const loadMarkers = (data) => {
    for (markerData of data) {
      var marker = L.marker([markerData.latitude, markerData.longitude]).addTo(
        mymap
      );
      let popupHTML = `
          <h3>${markerData.title}</h3><br>
          ${markerData.description}<br>
          <img src="${markerData.image_url}"/>`;
      marker.bindPopup(popupHTML);
      // --------------------
      L.control
        .Legend({
          position: "bottomleft",
          legends: [
            {
              label: "markerData.title",
              type: "image",
              url: "https://cdn4.buysellads.net/uu/1/72681/1600362731-MC_Carbon_Logo_260x200.png",
            },
          ],
        })
        .addTo(mymap);
    }
  };

  $.ajax({
    url: `/markers/${id}`,
    type: "get",
    success: loadMarkers,
    error: () => {
      console.log("error");
    },
  });

  let ctrlCoor = new L.Control.Coordinates();
  ctrlCoor.addTo(mymap);

  L.easyButton("fa-star", function () {
    console.log("clicked");
    console.log(id);
    $.ajax({
      url: `/favourites/addFromMap/${id}`,
      type: "post",
      success: () => {
        console.log("added");
        alert("Added as your fav!");
      },
      error: () => {
        console.log("error");
      },
    });
  }).addTo(mymap);
});
