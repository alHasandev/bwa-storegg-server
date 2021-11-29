/**
 * Format number to rupiah currency
 * @param {Number} number number value of currency
 * @returns {String} Rupiah currency formatted string
 */
const rupiah = (number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

module.exports = {
  rupiah,
};
