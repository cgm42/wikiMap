$(() => {
  let isPopupOpen = false;
  let currentMarker;
  const tempMarkerStorage = [];
  let popupTitle = "";
  let popupDesc = "";
  let popupUrl = "";

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
      accessToken:
        "sk.eyJ1IjoiY2dtZW93IiwiYSI6ImNrdHEzdXZ5bDBzcTcyeG8zY3d2eDZtdWIifQ.E0aRLAKw0M-8RLA2DaxicQ",
    }
  ).addTo(mymap);

  mymap.doubleClickZoom.disable();

  const onPopupClose = (e) => {
    const title = $("#marker-editor-title")[0].value;
    const desc = $("#marker-editor-desc")[0].value;
    const imgUrl = "#marker-editor-imgUrl"[0].value;
    tempMarkerStorage.push({
      title,
      desc,
      imgUrl,
      lng: currentMarker._latlng.lng,
      lat: currentMarker._latlng.lat,
      marker_id: currentMarker._icon.id,
    });
    $("#marker-editor").trigger("reset");
    isPopupOpen = false;
  };

  function onMapDblClick(e) {
    //debugger;
    //e.originalEvent.stopPropagation();
    //e.originalEvent.preventDefault();
    if (isPopupOpen) {
      return;
    }
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    const markerId = Math.floor(Math.random() * 100000000);
    // console.log(lat, lng, markerId);
    currentMarker = L.marker([lat, lng]).addTo(mymap);
    currentMarker.on("popupclose", onPopupClose);
    currentMarker.on("click", (e) => {
      console.log("e :>> ", e);
      currentMarker = e.target;
      debugger; //TODO: populate marker editor form
    });
    isPopupOpen = true;
    currentMarker._icon.id = markerId;
  }

  $("#marker-editor-title").on("input", (e) => {
    const input = $("#marker-editor-title")[0].value;
    popupTitle = input;
    let popupHTML = `
    <h3>${popupTitle}</h3><br>
    ${popupDesc}`;
    currentMarker.bindPopup(popupHTML).openPopup();
  });

  $("#marker-editor-desc").on("input", (e) => {
    const input = $("#marker-editor-desc")[0].value;
    popupDesc = input;
    let popupHTML = `
    <h3>${popupTitle}</h3><br>
    ${popupDesc}`;
    currentMarker.bindPopup(popupHTML).openPopup();
  });

  $("#marker-editor-url").on("input", (e) => {
    const input = $("#marker-editor-url")[0].value;
    popupDesc = input;
    let popupHTML = `
    <h3>${popupTitle}</h3><br>
    ${popupDesc}<br>
    <img src="${popupUrl}""`;
    currentMarker.bindPopup(popupHTML).openPopup();
  });

  mymap.on("dblclick", onMapDblClick);
});
