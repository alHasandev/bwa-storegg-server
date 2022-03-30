function defaultCallback(value) {
  return value;
}

/**
 * Sleep or halt process runtime
 * @param {Number} duration duration in miliseconds (ms)
 * @returns {Promise} Resolve when duration is up or reject when duration is not a number
 */
function sleep(duration) {
  return new Promise((resolve, reject) => {
    if (typeof duration !== 'number')
      return reject({
        code: 401,
        message: 'duration must be a number in miliseconds (ms)',
      });
    setTimeout(resolve, duration);
  });
}

/**
 * Get Random Number Between min and max number
 * @param {Number} min minimal number
 * @param {Number} max maximal number
 * @returns {Number} Random Number
 */
function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Save heavy callculation function and use it when same arguments is already called
 * @param {Function} callback callback function
 * @returns {Function} Memoized Function
 */
function memoize(callback) {
  const cache = new Map();

  return ({ ...args }) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);

    const result = callback(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Get array of specific key value from array of object
 * @param {Array} array array of object
 * @param {String} key key query
 * @returns {Array} Array of key value
 */
function pluck(array, key) {
  return array.map((element) => element[key]);
}

/**
 * Group array of object by key
 * @param {Array} array array of object
 * @param {String} key key of grouping by
 * @returns {Object} Object of grouping array by key
 */
function groupBy(array, key, transmuteValue = defaultCallback) {
  return array.reduce((group, element) => {
    const keyValue = element[key];
    const newElement = transmuteValue(element);
    const result = [...(group[keyValue] ?? []), newElement];
    return {
      ...group,
      [keyValue]: result,
    };
  }, {});
}

function groupByNested(array, objKey, transmuteValue = defaultCallback) {
  const result = array.reduce((group, element) => {
    const [obj, key] = objKey.split('.');
    const keyValue = element[obj][key];

    const newElement = transmuteValue(element);
    const newValue = [...(group[keyValue] ?? []), newElement];

    return {
      ...group,
      [keyValue]: newValue,
    };
  }, {});

  return result;
}

const LOCALES = undefined;

const CURRENCY_FORMATTER = new Intl.NumberFormat(LOCALES, {
  currency: 'IDR',
  style: 'currency',
  maximumFractionDigits: 0,
});
function formatCurrency(number) {
  return CURRENCY_FORMATTER.format(number);
}

const NUMBER_FORMATTER = new Intl.NumberFormat(LOCALES);
function formatNumber(number) {
  return NUMBER_FORMATTER.format(number);
}

const COMPACT_NUMBER_FOMATTER = new Intl.NumberFormat(LOCALES, {
  notation: 'compact',
});
function formatCompactNumber(number) {
  return COMPACT_NUMBER_FOMATTER.format(number);
}

const DIVISIONS = [
  { amount: 60, name: 'seconds' },
  { amount: 60, name: 'minutes' },
  { amount: 24, name: 'hours' },
  { amount: 7, name: 'days' },
  { amount: 4.34524, name: 'weeks' },
  { amount: 12, name: 'months' },
];
const RELATIVE_DATE_FORMATTER = new Intl.RelativeTimeFormat(LOCALES, {
  numeric: 'auto',
});

function formatRelativeDate(toDate, fromDate = new Date()) {
  let duration = (toDate - fromDate) / 1000;

  for (let i = 0; i <= DIVISIONS.length; i++) {
    const division = DIVISIONS[i];
    if (Math.abs(duration) < division.amount) {
      return RELATIVE_DATE_FORMATTER.format(
        Math.round(duration),
        division.name
      );
    }
    duration /= division.amount;
  }
}

module.exports = {
  groupByNested,
};
