$(() => {
  let isPopupOpen = false; //create new marker only allowed if false
  let currentMarker;
  let popupTitle = "";
  let popupDesc = "";
  let popupUrl = "";
  let mapId;
  let long = 13.405;
  let lat = 52.52;

  var mymap = L.map("mapid");
  mymap.locate({ setView: true, maxZoom: 12 });
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
    const imgUrl = $("#marker-editor-imgUrl")[0].value;
    const lat = currentMarker.getLatLng().lat;
    const lng = currentMarker.getLatLng().lng;
    console.log(currentMarker._icon.id);
    $("#marker-editor").trigger("reset");
    // Save new marker to db if no marker id
    if (currentMarker._icon.id.length === 0) {
      return $.ajax({
        url: "markers",
        type: "post",
        data: { mapId, title, desc, imgUrl, lat, lng },
        success: (data) => {
          currentMarker._icon.id = data.id;
          alert("marker saved to db! make another one!");
          isPopupOpen = false;
        },
        error: () => {
          console.log("error");
        },
      });
    } else {
      //If id available, update existing marker in db
      $.ajax({
        url: `markers/${currentMarker._icon.id}`,
        type: "put",
        data: { title, desc, imgUrl },
        success: (data) => {
          alert("marker updated! make another one!");
          isPopupOpen = false;
        },
        error: () => {
          console.log("error");
        },
      });
    }
  };

  //populate editor with existing value when marker is clicked
  const onMarkerClick = (e) => {
    currentMarker = e.target;
    popupTitle = e.target._popup._contentNode.firstElementChild.innerText;
    popupDesc =
      e.target._popup._contentNode.firstElementChild.nextSibling.nextSibling.data.trim();
    popupUrl = e.target._popup._contentNode.getElementsByTagName("img")[0].src;
    $("#marker-editor-title")[0].value = popupTitle;
    $("#marker-editor-desc")[0].value = popupDesc;
    $("#marker-editor-imgUrl")[0].value = popupUrl;
  };

  //create a new marker on dblclick
  function onMapDblClick(e) {
    if (isPopupOpen) {
      return;
    }
    if (mapId === undefined) {
      alert("Create a name & desc first!");
      return;
    }

    popupTitle = "";
    popupDesc = "";
    popupUrl = "";
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    //generate a random markerId for temp use
    //const markerId = Math.floor(Math.random() * 100000000);
    currentMarker = L.marker([lat, lng]).addTo(mymap);

    //save content on popup close
    currentMarker.on("popupclose", onPopupClose);

    //select a marker on click
    currentMarker.on("click", onMarkerClick);

    isPopupOpen = true;
    //currentMarker._icon.id = markerId;
  }

  //bind a popup with updated html to marker
  const updateMarkerHTML = (marker) => {
    let popupHTML = `
    <h3>${popupTitle}</h3><br>
    ${popupDesc}<br>
    <img src="${popupUrl}"/>`;
    marker.bindPopup(popupHTML).openPopup();
  };

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

  //sync image in popup
  $("#marker-editor-imgUrl").on("input", (e) => {
    const input = e.target.value;
    popupUrl = input;
    updateMarkerHTML(currentMarker);
  });

  mymap.on("dblclick", onMapDblClick);

  //save map to db
  $("#save-map-button").on("click", (e) => {
    e.preventDefault();

    const title = $("#map-editor-title")[0].value;
    const desc = $("#map-editor-desc")[0].value;
    const lat = mymap.getBounds().getCenter().lat;
    const lng = mymap.getBounds().getCenter().lng;
    const zoom = mymap._zoom;
    const isPublic = true;

    $.ajax({
      url: "/maps",
      type: "post",
      data: { lat, lng, zoom, title, desc, isPublic },
      success: (data) => {
        mapId = data.id;
        alert("Map saved to db, ready to create markers!");
      },
      error: () => {
        console.log("error");
      },
    });
  });

  //delete map from db and back to home
  $("#delete-map-button").on("click", (e) => {
    e.preventDefault();
    console.log("mymap :>> ", mymap);
    //TODO:
  });

  $("#delete-marker-button").on("click", (e) => {
    //TODO:
  });
});
