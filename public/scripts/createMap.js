$(() => {
  let isPopupOpen = false; //create new marker only allowed if false
  let currentMarker;
  let mapTitle = "";
  let mapDesc = "";
  let popupTitle = "";
  let popupDesc = "";
  let popupUrl = "";
  let mapId;

  var mymap = L.map("mapid").locate({ setView: true, maxZoom: 12 });
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

  //Save marker on popup close
  const onPopupClose = (e) => {
    const data = getValuesFromMarker(e.target);
    if (data === null) {
      return;
    }
    const title = data.title;
    const desc = data.desc;
    const imgUrl = data.url;

    const lat = currentMarker.getLatLng().lat;
    const lng = currentMarker.getLatLng().lng;
    $("#marker-editor").trigger("reset");
    console.log("payload", { title, desc, imgUrl });
    $("#marker-editor-imgUrl")[0].value = "";
    // Save new marker to db if no marker id

    if (currentMarker._icon.id.length === 0) {
      return $.ajax({
        url: "/markers",
        type: "post",
        data: { mapId, title, desc, imgUrl, lat, lng },
        success: (data) => {
          currentMarker._icon.id = data.id;
          isPopupOpen = false;
        },
        error: () => {
          console.log("error");
        },
      });
    } else {
      //If id available, update existing marker in db

      return $.ajax({
        url: `/markers/${currentMarker._icon.id}`,
        type: "put",
        data: { title, desc, imgUrl },
        success: (data) => {
          isPopupOpen = false;
        },
        error: () => {
          console.log("error");
        },
      });
    }
  };

  //open editor and populate with existing value when marker is clicked
  const onMarkerClick = (e) => {
    currentMarker = e.target;
    const data = getValuesFromMarker(currentMarker);
    if (data === null) {
      return;
    }
    //get marker content
    popupTitle = data.title;
    popupDesc = data.desc;
    popupUrl = data.url;
    //open marker editor
    $("#map-editor").addClass("inactive");
    $("#marker-editor").removeClass("inactive");
    $(".toggle-form, .formwrap, .toggle-bg").addClass("active");
    // populate values
    $("#marker-editor-title")[0].value = popupTitle;
    $("#marker-editor-desc")[0].value = popupDesc;
    $("#marker-editor-imgUrl")[0].value = popupUrl;
  };

  //helper function: returns data from marker obj
  /**
   *
   * @param {*} marker
   * @returns null | object Returns null when there is no popup, otherwise return info object
   */
  const getValuesFromMarker = (marker) => {
    const popupElement = marker.getPopup().getElement();
    if (popupElement === undefined) return null;
    const title = popupElement.getElementsByTagName("h4")[0].textContent;
    const desc = popupElement.getElementsByTagName("p")[0].textContent;
    if (popupElement.getElementsByClassName("imgUrl")[0] === undefined) {
      url = "";
    } else {
      url = popupElement.getElementsByClassName("imgUrl")[0].src;
    }
    const result = { title, desc, url };
    return result;
  };

  //click anywhere on map to hide menu
  function onMapClick(e) {
    $(".toggle-form, .formwrap, .toggle-bg").removeClass("active");
  }

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
    currentMarker = L.marker([lat, lng]).addTo(mymap);
    //save content on popup close
    currentMarker.on("popupclose", onPopupClose);
    //select a marker on click
    currentMarker.on("click", onMarkerClick);
    isPopupOpen = true;
    //toggle marker editor
    $(".toggle-form, .formwrap, .toggle-bg").addClass("active");
    $("#marker-editor").removeClass("inactive");
  }

  //bind a popup with updated html to marker
  const updateMarkerHTML = (marker) => {
    console.log("updateMarkerHTML");

    let popupHTML = `
    <img class='imgUrl' src="${popupUrl}" style="max-height: 300px; max-width: 300px;"/>
    <h4>${popupTitle}</h4>
    <p>${popupDesc}</p>
    `;
    marker.bindPopup(popupHTML);
    marker.openPopup();

    setTimeout(() => {
      console.log("settimeout");
      marker._popup._updateLayout();
      marker.openPopup();
    }, 800);
  };

  const updateMarkerHTML4Image = (marker) => {
    console.log("updateMarkerHTML4Image");
    let popupHTML = `
    <img class='imgUrl' src="${popupUrl}" style="max-height: 300px; max-width: 300px;"/>
    <h4>${popupTitle}</h4>
    <p>${popupDesc}</p>
    `;
    marker.bindPopup(popupHTML, { maxWidth: "300px" });
    marker.openPopup();
    // marker._popup._updateLayout();
    // marker.closePopup();
    //marker.openPopup();
    setTimeout(() => {
      marker._popup._updateLayout();
      marker.openPopup();
    }, 800);
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

  //save imgurl from modal
  $("#save-image-button").on("click", (e) => {
    popupUrl = $("#marker-editor-imgUrl")[0].value;
    updateMarkerHTML4Image(currentMarker);
    $("#imageModal").modal("hide");
  });

  mymap.on("click", onMapClick);
  mymap.on("dblclick", onMapDblClick);

  //save(update) map to db
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
      type: "put",
      data: { lat, lng, zoom, title, desc, isPublic },
      success: (data) => {
        $("#map-editor-title")[0].value = mapTitle;
        $("#map-editor-desc")[0].value = mapDesc;
      },
      error: (err) => {
        console.log("error", err);
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

  // slider control for map editor
  $(".map-button").on("click", function () {
    if (!$(".toggle-form, .formwrap, .toggle-bg").hasClass("active")) {
      //display menu
      $(".toggle-form, .formwrap, .toggle-bg").addClass("active");
      $("#marker-editor").addClass("inactive");
      $("#map-editor").removeClass("inactive");
    } else if ($("#map-editor").hasClass("inactive")) {
      //change to map menu
      $("#marker-editor").addClass("inactive");
      $("#map-editor").removeClass("inactive");
    } else {
      //hide menu
      $(".toggle-form, .formwrap, .toggle-bg").removeClass("active");
      $("#map-editor").addClass("inactive");
    }
  });

  // slider control for marker editor
  $(".marker-button").on("click", function () {
    if (!$(".toggle-form, .formwrap, .toggle-bg").hasClass("active")) {
      //display
      $(".toggle-form, .formwrap, .toggle-bg").addClass("active");
      $("#map-editor").addClass("inactive");
      $("#marker-editor").removeClass("inactive");
    } else if ($("#marker-editor").hasClass("inactive")) {
      //change to map menu
      $("#map-editor").addClass("inactive");
      $("#marker-editor").removeClass("inactive");
    } else {
      //hide
      $(".toggle-form, .formwrap, .toggle-bg").removeClass("active");
      $("#marker-editor").addClass("inactive");
    }
  });
});
