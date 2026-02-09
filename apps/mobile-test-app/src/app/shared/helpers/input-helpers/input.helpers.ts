import { REG_EXP } from '@mobile-test-app/constants/reg-exp/reg-exp';

export function sanitizeSignedDecimal(raw: string | number, opts: { allowNegative: boolean; fractionDigits: number }): string {
  // normalize inout with minuses and set to string
  let input = (raw.toString() ?? '').replace(/\s+/g, '').replace(/[−–—]/g, '-');

  // leave only digits and dot, comma and minus
  input = input.replace(REG_EXP.onlyDigitsDotCommaMinus, '');

  // only one minus allowed at the start
  const hadLeadingMinus = opts.allowNegative && input.startsWith('-');

  input = input.replace(REG_EXP.minus, '');

  if (hadLeadingMinus) input = `-${input}`;

  // only one dot or comma allowed, all comma replace with dot;
  input = input.replace(REG_EXP.comma, '.');

  const firstDot = input.indexOf('.');

  if (firstDot !== -1) {
    input = input.slice(0, firstDot + 1) + input.slice(firstDot + 1).replace(REG_EXP.dot, '');
  }

  // fractional part limit: maximum of N characters after the dot
  if (opts.fractionDigits >= 0 && firstDot !== -1) {
    const dot = input.indexOf('.');

    if (dot !== -1) {
      const intPart = input.slice(0, dot + 1);
      const fracPart = input.slice(dot + 1, dot + 1 + opts.fractionDigits);

      input = intPart + fracPart;
    }
  }

  input = substituteZeroDotOrCommaStarts(input);

  // check for duplicate zero and replace the first zero
  const isNegative = input.startsWith('-');
  const body = isNegative ? input.slice(1) : input;
  const dotIndex = body.indexOf('.');
  const intPart = dotIndex === -1 ? body : body.slice(0, dotIndex);
  const fracPart = dotIndex === -1 ? null : body.slice(dotIndex + 1);

  if (intPart.length) {
    const trimmedInt = intPart.replace(/^0+/, '');
    const normalizedInt = trimmedInt.length === 0 ? '0' : trimmedInt;
    const normalizedBody = fracPart != null ? `${normalizedInt}.${fracPart}` : normalizedInt;

    input = isNegative ? `-${normalizedBody}` : normalizedBody;
  }

  // remove minus if not allowed
  if (!opts.allowNegative) {
    input = input.replace(REG_EXP.minus, '');
  }

  return input;
}

function substituteZeroDotOrCommaStarts(input: string): string {
  if (input.startsWith('.')) {
    input = `0${input}`;
  }

  if (input.startsWith('-.')) {
    input = input.replace('-.', '-0.');
  }

  return input;
}
