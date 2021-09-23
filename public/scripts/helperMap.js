/**
 * Setup global state for the map file
 */

//const marker = require("../../routes/marker");

let currentMarker;
let isPopupOpen = false; //create new marker only allowed if false
let mapDesc = "";
let mapId;
let mapTitle = "";
let popupDesc = "";
let popupTitle = "";
let popupUrl = "";
let mymap;

//Save/update marker on popup close
const onPopupClose = (e) => {
  const data = getValuesFromMarker(e.target);
  if (data === null || e.target._icon === null) {
    return;
  }
  const title = data.title;
  const desc = data.desc;
  const imgUrl = data.url;

  const lat = currentMarker.getLatLng().lat;
  const lng = currentMarker.getLatLng().lng;
  $("#marker-editor").trigger("reset");
  $("#marker-editor-imgUrl")[0].value = "";
  // Save new marker to db if no marker id

  if (currentMarker._icon.id.length === 0) {
    const data = { mapId, title, desc, imgUrl, lat, lng };
    console.log("sending post to /markers endpoint :>> ", data);
    return $.ajax({
      url: "/markers",
      type: "post",
      data,
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
    const data = { title, desc, imgUrl };
    console.log("sending put to /markers endpoint :>> ", data);

    return $.ajax({
      url: `/markers/${currentMarker._icon.id}`,
      type: "put",
      data,
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

const onMarkerDelete = (e) => {
  e.preventDefault();
  const marker_id = currentMarker._icon.id;
  console.log("deleting marker id " + marker_id);
  $.ajax({
    url: `/markers/delete/${marker_id}`,
    type: "delete",
    success: () => {
      mymap.removeLayer(currentMarker);
    },
    error: () => {
      console.log("error");
    },
  });
};

//======================      HELPERS     ========================
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
  if (
    !popupElement.getElementsByClassName("imgUrl")[0] ||
    !popupElement.getElementsByClassName("imgUrl")[0].attributes.src
  ) {
    url = "";
  } else {
    url =
      popupElement.getElementsByClassName("imgUrl")[0].attributes.src
        .textContent;
  }
  console.log("url :>> ", url);
  const result = { title, desc, url };
  return result;
};

const updateMarkerHTML = (marker) => {
  // console.log("updateMarkerHTML");
  let popupHTML = `
  <img class='imgUrl' src="${popupUrl}" style="max-height: 300px; max-width: 300px;"/>
  <h4>${popupTitle}</h4>
  <p>${popupDesc}</p>
  `;
  // marker.bindPopup(popupHTML, { maxWidth: "300px" });
  marker.bindPopup(popupHTML);
  // marker.bindPopup(popupHTML, { maxWidth: "300px" });
  marker.openPopup();

  setTimeout(() => {
    marker.getPopup()._updateLayout();
    marker.openPopup();
  }, 100);
};
