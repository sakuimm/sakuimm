import { Transaksi } from '../types';

export interface DateParts {
  year: number | null;
  month: number | null; // 1 - 12
}

export const INDONESIAN_MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
];

/**
 * Universal date parser that handles:
 * - ISO format: "2026-08-28" or "2026-08"
 * - Indonesian text format: "5 Agu 2026", "10 Agustus 2026"
 * - Date ranges: "02 - 04 September 2026"
 */
export function parseDateParts(dateStr?: string | null): DateParts {
  if (!dateStr) return { month: null, year: null };
  const s = String(dateStr).trim().toLowerCase();

  // 1. Check ISO format: YYYY-MM-DD or YYYY-MM
  const isoMatch = s.match(/^(\d{4})-(\d{1,2})/);
  if (isoMatch) {
    return {
      year: parseInt(isoMatch[1], 10),
      month: parseInt(isoMatch[2], 10)
    };
  }

  // 2. Extract 4-digit Year
  const yearMatch = s.match(/\b(20\d{2})\b/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : null;

  // 3. Extract Month from textual Indonesian names
  let month: number | null = null;
  if (s.includes('jan')) month = 1;
  else if (s.includes('feb')) month = 2;
  else if (s.includes('mar')) month = 3;
  else if (s.includes('apr')) month = 4;
  else if (s.includes('mei') || s.includes('may')) month = 5;
  else if (s.includes('jun')) month = 6;
  else if (s.includes('jul')) month = 7;
  else if (s.includes('agu') || s.includes('aug')) month = 8;
  else if (s.includes('sep')) month = 9;
  else if (s.includes('okt') || s.includes('oct')) month = 10;
  else if (s.includes('nov')) month = 11;
  else if (s.includes('des') || s.includes('dec')) month = 12;

  return { month, year };
}

/**
 * Filter a list of transactions based on selected month (1..12 or 'ALL')
 * and selected year (e.g. '2026' or 'ALL').
 */
export function filterTransaksiByPeriod(
  list: Transaksi[],
  bulan: string,
  tahun: string
): Transaksi[] {
  return list.filter((trx) => {
    const { month, year } = parseDateParts(trx.tanggal);

    // Check year filter
    if (tahun !== 'ALL') {
      const targetYear = parseInt(tahun, 10);
      if (year !== null && year !== targetYear) {
        return false;
      }
    }

    // Check month filter
    if (bulan !== 'ALL') {
      const targetMonth = parseInt(bulan, 10);
      if (month !== null && month !== targetMonth) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Format today's date into Indonesian format: e.g. "26 Oktober 2026"
 */
export function getFormattedTodayIndonesian(): string {
  const now = new Date();
  const day = now.getDate();
  const monthName = INDONESIAN_MONTH_NAMES[now.getMonth()];
  const year = now.getFullYear();
  return `${day} ${monthName} ${year}`;
}
