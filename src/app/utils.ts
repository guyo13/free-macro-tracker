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

export function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function roundedToFixed(
  realNumber: number,
  decimalDigits: number
): string {
  let rounded = Math.pow(10, decimalDigits);
  return (Math.round(realNumber * rounded) / rounded).toFixed(decimalDigits);
}
