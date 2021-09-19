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

  const onMarkerClick = (e) => {
    popupTitle = "";
    popupDesc = "";
    popupUrl = "";

    currentMarker = e.target;
    const titleText = e.target._popup._contentNode.firstElementChild.innerText;
    const descText =
      e.target._popup._contentNode.firstElementChild.nextSibling.nextSibling.data.trim();
    $("#marker-editor-title")[0].value = titleText;
    $("#marker-editor-desc")[0].value = descText;
    debugger;
  };

  //create a marker on dblclick
  function onMapDblClick(e) {
    if (isPopupOpen) {
      return;
    }
    popupTitle = "";
    popupDesc = "";
    popupUrl = "";
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    const markerId = Math.floor(Math.random() * 100000000);
    currentMarker = L.marker([lat, lng]).addTo(mymap);

    //save content on popup close
    currentMarker.on("popupclose", onPopupClose);

    //select a marker on click
    currentMarker.on("click", onMarkerClick);

    isPopupOpen = true;
    currentMarker._icon.id = markerId;
  }

  //sync typing in popup and editor for title
  $("#marker-editor-title").on("input", (e) => {
    const input = $("#marker-editor-title")[0].value;
    popupTitle = input;
    let popupHTML = `
    <h3>${popupTitle}</h3><br>
    ${popupDesc}`;
    currentMarker.bindPopup(popupHTML).openPopup();
  });

  //sync typing in popup and editor for desc
  $("#marker-editor-desc").on("input", (e) => {
    const input = $("#marker-editor-desc")[0].value;
    popupDesc = input;
    let popupHTML = `
    <h3>${popupTitle}</h3><br>
    ${popupDesc}`;
    currentMarker.bindPopup(popupHTML).openPopup();
  });

  //doesn't really work for imgurl
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
