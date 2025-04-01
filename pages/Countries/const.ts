import { REVERSE, taxSortKeys } from 'const';

export const SEPARATOR = '-';

export const taxFilterOptions = [
  { value: 'reset', label: 'All' },
  { options: [], label: 'Region' },
];

export const taxSortOptions = [
  { value: taxSortKeys.COUNTRY, key: 'sortOptions.countryAZ' },
  { value: `${taxSortKeys.COUNTRY}${SEPARATOR}${REVERSE}`, key: 'sortOptions.countryZA' },
  { value: taxSortKeys.REGION, key: 'sortOptions.regionAZ' },
  { value: `${taxSortKeys.REGION}${SEPARATOR}${REVERSE}`, key: 'sortOptions.regionZA' },
  { value: taxSortKeys.RATE, key: 'sortOptions.rateLow' },
  { value: `${taxSortKeys.RATE}${SEPARATOR}${REVERSE}`, key: 'sortOptions.rateHigh' },
  { value: taxSortKeys.DIGITAL_VAT, key: 'sortOptions.digitalRateLow' },
  { value: `${taxSortKeys.DIGITAL_VAT}${SEPARATOR}${REVERSE}`, key: 'sortOptions.digitalRateHigh' },
];

export const keysMap = {
  Region: 'regions',
};
