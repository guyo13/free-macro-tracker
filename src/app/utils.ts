export function isFunction(fn: any) {
  return typeof fn === "function";
}
export function isPercent(num: any) {
  if (!isNaN(num)) {
    if (num >= 0 && num <= 100) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
export function isString(s: any) {
  return typeof s === "string";
}
export function isNumber(input: any) {
  if (input === "" || isNaN(input) || input == null) {
    return false;
  } else {
    return true;
  }
}
export function isDate(date: any) {
  return (
    date &&
    Object.prototype.toString.call(date) === "[object Date]" &&
    !isNaN(date)
  );
}
