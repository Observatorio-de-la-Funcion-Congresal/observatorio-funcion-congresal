const NBSP = '\u00A0';

export function fmtInt(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
}

export function fmtDec(n: number, digits = 1): string {
  const [int, dec] = n.toFixed(digits).split('.');
  const intPart = int.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  return dec ? `${intPart},${dec}` : intPart;
}

export function fmtPct(n: number, digits = 1): string {
  return `${fmtDec(n, digits)}${NBSP}%`;
}
