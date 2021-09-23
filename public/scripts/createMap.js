$(() => {
  /**
   * Load map baesd on location service
   */
  mymap = L.map("mapid").locate({ setView: true, maxZoom: 12 });
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

  /**
   * Show create map modal on page load
   */
  $("#myModalHorizontal").modal("show");
  $("#create-map-button").on("click", (e) => {
    e.preventDefault();
    mapTitle = $("#new-map-title")[0].value;
    mapDesc = $("#new-map-desc")[0].value;

    const lat = mymap.getBounds().getCenter().lat;
    const lng = mymap.getBounds().getCenter().lng;
    const zoom = mymap._zoom;
    const isPublic = true; //TODO:

    $.ajax({
      url: "/maps",
      type: "post",
      data: { lat, lng, zoom, title: mapTitle, desc: mapDesc, isPublic },
      success: (data) => {
        mapId = data.id;
        $("#myModalHorizontal").modal("hide");
        $("#map-editor-title")[0].value = mapTitle;
        $("#map-editor-desc")[0].value = mapDesc;
      },
      error: () => {
        console.log("error");
      },
    });
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
