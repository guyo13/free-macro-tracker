export function isFunction(fn: any) {
  return typeof fn === "function";
}
export function isPercent(num: any) {
  return !isNaN(num) && num >= 0 && num <= 100;
}

export function isString(s: any) {
  return typeof s === "string";
}

export function isNullOrEmptyString(s: any) {
  return s == null || s === "";
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

export function isDateString(dateString: any) {
  return isString(dateString) && isDate(new Date(dateString));
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
