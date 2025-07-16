export function formatNumber(val: number | string, decimal = 2, autoPadZero = true): string {
  const num = Number.parseFloat(`${val}`);
  if (Number.isNaN(num)) return '-';
  let str = num.toLocaleString('en-GB');
  if (autoPadZero) {
    const [a, b = ''] = str.split('.');
    if (b.length < decimal) str = `${a}.${b}${'0'.repeat(decimal - b.length)}`;
  }
  return decimal === 0
    ? str.replace(/\.\d*$/, '')
    : str.replace(/\.\d*$/, (v) => v.slice(0, decimal + 1));
}

export const formattedTime = (date: Date) =>
  date.toLocaleString('en-AU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
