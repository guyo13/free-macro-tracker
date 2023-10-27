export default function enumify<T>(enumm: T): {
  isValid: (t) => boolean;
} {
  const VALUES = Object.values(enumm);

  function isValid(t): boolean {
    return t && VALUES.includes(t);
  }

  return {
    isValid,
  };
}
