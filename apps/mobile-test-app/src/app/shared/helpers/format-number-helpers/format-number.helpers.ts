export function trimZeroFromNumber(value: number): string {
  if (!value) return '0';

  if (Number.isInteger(value)) {
    return value.toString();
  }

  return value.toString().replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
}

export function toFixedNumber(value: number, digits: number = 2): number {
  const m = Math.pow(10, digits);

  return Math.trunc(value * m) / m;
}
