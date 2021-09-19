export function getMarkerWithId(arr, id) {
  return arr.filter((marker) => {
    marker._icon.id === id;
  });
}
