// Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a GNU GPL
// license that can be found in the LICENSE file.
const EMPTY_OBJ = {};

export function isFunction(fn: any) {
  return typeof fn === "function";
}

export function isPercent(num: any) {
  // TODO - Replace isNaN with Number.isFinite
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

export function isPositiveNumber(x: any) {
  return Number.isFinite(x) && x > 0;
}

export function isNonNegativeNumber(x: any) {
  return Number.isFinite(x) && x >= 0;
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
  const rounded = Math.pow(10, decimalDigits);
  return (Math.round(realNumber * rounded) / rounded).toFixed(decimalDigits);
}

export function isEmptyObject(obj?: object) {
  return Object.keys(obj ?? EMPTY_OBJ).length === 0;
}
