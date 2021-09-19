$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users",
  }).done((users) => {
    for (user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });

  var mymap = L.map("mapid").setView([51.505, -0.09], 13);
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      //TODO:
      accessToken:
        "sk.eyJ1IjoiY2dtZW93IiwiYSI6ImNrdHEzdXZ5bDBzcTcyeG8zY3d2eDZtdWIifQ.E0aRLAKw0M-8RLA2DaxicQ",
    }
  ).addTo(mymap);

  let markerReadyStatus = true;

  let marker;
  const markers = [];
  const tempMarkerStorage = [];

  function onMapClick(e) {
    if (!markerReadyStatus) {
      return;
    }
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(mymap);
    marker.bindPopup().openPopup();
    markerReadyStatus = false;

    $("#popup-form").on("submit", (event) => {
      event.preventDefault();

      const title = $("#popup-title")[0].value;
      const desc = $("#popup-description")[0].value;
      const imgUrl = $("#popup-img-url")[0].value;
      console.log("title :>> ", title);
      console.log("desc :>> ", desc);
      console.log("imgUrl :>> ", imgUrl);
      marker.closePopup();
      markers.push(marker);
      debugger;
      tempMarkerStorage.push({
        title,
        desc,
        imgUrl,
        lng: lng,
        lat: lat,
      });
      markerReadyStatus = true;
    });

    marker.on("click", (e) => {
      let markerData = tempMarkerStorage.filter((obj) => {
        marker._latlng.lat === obj.lat && marker._latlng.lng === obj.lng;
      });

      if (markerData.length !== 1) {
        alert(`Cannot find marker data! ${JSON.stringify(marker._latlng)}`);
      }

      markerData = markerData[0];

      marker
        .bindPopup(
          `${tempMarkerStorage.title}
        ${tempMarkerStorage.desc}
        ${tempMarkerStorage.imgUrl}`
        )
        .openPopup();
    });
  }

  mymap.on("click", onMapClick);
});
