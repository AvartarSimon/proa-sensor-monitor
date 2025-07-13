const uiConfig = {
  width: 2200,
  height: 1080,
  base_num: 100,
};

export function toAdaptedPx(value: number) {
  // Check if window.__adaptorWidth is available, if not use a fallback
  if (typeof window !== 'undefined' && window.__adaptorWidth) {
    return value / (uiConfig.width / window.__adaptorWidth);
  }
  // Fallback to original value if adaptor width is not set yet
  return value;
}

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
