$(() => {
  mapId = id;
  $("#map-editor-title")[0].value = mapTitle;
  $("#map-editor-desc")[0].value = mapDesc;

  mymap = L.map("mapid").setView(
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

  mymap.doubleClickZoom.disable();
  //---------------------------

  ctrlCoor = new L.Control.Coordinates();
  ctrlCoor.addTo(mymap);

  //------------------------

  const loadMarkers = (data) => {
    for (markerData of data) {
      var marker = L.marker([markerData.latitude, markerData.longitude]).addTo(
        mymap
      );
      let popupHTML = `
      <img class='imgUrl' src="${markerData.image_url}" style="max-height: 300px; max-width: 300px;"/>
      <h4>${markerData.title}</h4>
      <p>${markerData.description}</p>
      `;
      marker.bindPopup(popupHTML, { maxWidth: "300px" });
      marker._icon.id = markerData.id;
      marker.openPopup();
      marker.closePopup();
      marker.on("popupclose", onPopupClose);
      marker.on("click", onMarkerClick);
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

  //sync typing in popup and editor for title
  $("#marker-editor-title").on("input", (e) => {
    const input = e.target.value;
    popupTitle = input;
    updateMarkerHTML(currentMarker);
  });

  //sync typing in popup and editor for desc
  $("#marker-editor-desc").on("input", (e) => {
    const input = e.target.value;
    popupDesc = input;
    updateMarkerHTML(currentMarker);
  });

  //save imgurl from modal
  $("#save-image-button").on("click", (e) => {
    popupUrl = $("#marker-editor-imgUrl")[0].value;
    updateMarkerHTML(currentMarker);
    $("#imageModal").modal("hide");
  });

  mymap.on("click", onMapClick);
  mymap.on("dblclick", onMapDblClick);

  //save(update) map to db
  $("#save-map-button").on("click", onSaveMapClick);

  //delete map from db and back to home
  $("#delete-map-button").on("click", (e) => {
    e.preventDefault();
    console.log("mymap :>> ", mymap);
    //TODO:
  });

  $("#delete-marker-button").on("click", onMarkerDelete);

  // slider control for map editor
  $(".map-button").on("click", onMapEditorButtonClick);

  // slider control for marker editor
  $(".marker-button").on("click", onMarkerEditorButtonClick);

  //slider control for basemap editor
  $(".basemap-button").on("click", onBasemapMenuOpen);

  $(".list-group-item").on("click", onBasemapOptionClick);
});
