import { CountryFormValues, TaxOverridePopupFormValues } from './types';
import { COUNTRY_TAX } from './const';

const getCountryTaxError = (countryTax?: string, isZeroValueValid = true): string | null => {
  const countryTaxNumber = Number(countryTax);
  const belowZeroCondition = isZeroValueValid ? countryTaxNumber < 0 : countryTaxNumber <= 0;

  if (Number.isNaN(countryTaxNumber)) {
    return 'errors.incorrect_format';
  }

  if (countryTaxNumber >= 100) {
    return 'errors.must_be_less_than_100_percent';
  }

  if (belowZeroCondition) {
    return 'errors.must_be_more_than_0_percent';
  }

  return null;
};

export const validateCountryTax = (values: CountryFormValues) => {
  const errors: Record<string, string | undefined> = {};
  const { countryTax } = values;
  const countryTaxError = getCountryTaxError(countryTax);

  if (countryTaxError) {
    errors[COUNTRY_TAX] = countryTaxError;
  }

  return errors;
};

export const validateTaxOverride = (values: TaxOverridePopupFormValues) => {
  const errors: Record<string, string | undefined> = {};
  const { collectionTax, collectionId } = values;
  const countryTaxError = getCountryTaxError(collectionTax, false);

  if (!collectionId) {
    errors.collectionId = 'errors.select_item_from_the_list';
  }

  if (countryTaxError) {
    errors.collectionTax = countryTaxError;
  }

  return errors;
};
