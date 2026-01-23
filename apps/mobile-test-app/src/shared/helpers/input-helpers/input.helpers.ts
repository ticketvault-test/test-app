export function onlyNumberInput(value: string, allowNegative: boolean = false): string {
  let input = value;

  console.log('allowNegative', allowNegative);
  console.log('input.startsWith(\'-\')', input.startsWith('-'));
    console.log(input);

  let isNegative = false;
  if (allowNegative && input.startsWith('-')) {
    isNegative = true;
    input = input.substring(1);
  }

  input = input.replace(/[^0-9.,]/g, '');
  input = input.replace(/,/g, '.');

  const firstDotIndex = input.indexOf('.');
  if (firstDotIndex !== -1) {
    input = input.substring(0, firstDotIndex + 1) + input.substring(firstDotIndex + 1).replace(/\./g, '');
    const parts = input.split('.');
    if (parts[1]) {
      parts[1] = parts[1].substring(0, 2);
      input = parts[0] + '.' + parts[1];
    }
  }

  if (/^0[0-9]/.test(input)) {
    input = String(parseInt(input, 10));
  }

  if (isNegative) {
    if (!input.length) {
      return '-';
    }
    if (input === '0') {
      input = '-0';
    } else {
      input = '-' + input;
    }
  }

  return input;
}
