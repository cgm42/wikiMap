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

  let ctrlCoor = new L.Control.Coordinates();
  ctrlCoor.addTo(mymap);

  const loadMarkers = (data) => {
    const legendArr = [];
    for (markerData of data) {
      var marker = L.marker([markerData.latitude, markerData.longitude]).addTo(
        mymap
      );
      let popupHTML = `<img class='imgUrl' src="${markerData.image_url}" style="max-height: 300px; max-width: 300px;"/>
      <h4>${markerData.title}</h4>
      <p>${markerData.description}</p>
      `;
      legendArr.push({
        label: markerData.title,
        type: "image",
        url: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      });

      marker.bindPopup(popupHTML, { maxWidth: "300px" });
      marker.openPopup();
      marker.closePopup();
    }
    L.control
      .Legend({
        position: "bottomright",
        legends: legendArr,
      })
      .addTo(mymap);
  };

  $.ajax({
    url: `/markers/${id}`,
    type: "get",
    success: loadMarkers,
    error: () => {
      console.log("error");
    },
  });

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
