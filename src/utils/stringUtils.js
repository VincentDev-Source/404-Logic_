/**
 * CivicPulse SDG 11 - String Utilities & URL Parameter Sanitization
 */

/**
 * Safely decodes URI strings that may be single or double URL-encoded (e.g. %2520 -> %20 -> space).
 * Also cleans up '+' symbols and lingering '%20' artifacts.
 *
 * @param {string} str - Raw string or URL param value
 * @returns {string} Clean, decoded string
 */
export function safeDecodeString(str) {
  if (!str || typeof str !== 'string') return '';
  let result = str;
  for (let i = 0; i < 3; i++) {
    if (result.includes('%')) {
      try {
        const decoded = decodeURIComponent(result);
        if (decoded === result) break;
        result = decoded;
      } catch {
        break;
      }
    } else {
      break;
    }
  }
  return result.replace(/%20/g, ' ').replace(/\+/g, ' ').trim();
}

/**
 * Formats a currency amount into standard Indonesian Rupiah format (e.g. Rp 100.000)
 *
 * @param {number|string} amount
 * @returns {string}
 */
export function formatRupiah(amount) {
  const num = parseInt(amount, 10) || 0;
  return `Rp ${num.toLocaleString('id-ID')}`;
}
