export function hasLocalStorage() {
  return "localStorage" in window && window["localStorage"];
}
