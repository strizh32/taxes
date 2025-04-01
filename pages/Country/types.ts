import { EntitiesConnectionItem, ID, TaxOverride, TaxRate } from 'types';

export interface TaxRatesQueryResult {
  taxRates: EntitiesConnectionItem<TaxRate>;
}

export interface TaxOverridesQueryResult {
  taxOverrides: EntitiesConnectionItem<TaxOverride>;
}

export interface UpdateTaxRateMutationResponseData {
  taxRateUpdate: {
    rate: TaxRate;
    error: {
      code: 'VALIDATE';
      fields: {
        field: string;
        message: string[];
      }[];
      message: string;
    };
  };
}

export interface DeleteTaxRateMutationResponseData {
  taxRateDelete: {
    rate: TaxRate;
    error: {
      message: string;
    };
  };
}

export interface UpdateTaxRateMutationVariables {
  input: {
    country: string;
    rate: number;
    digitalRate?: number;
  };
}

export interface DeleteTaxOverrideResponseData {
  taxOverrideDelete: {
    error: {
      message: string;
    };
  };
}

export interface DeleteTaxRateMutationVariables {
  input: {
    country: string;
  };
}

export interface DeleteTaxOverrideVariables {
  input: {
    id: ID;
  };
}

export interface UpdateTaxOverrideResponseData {
  taxOverrideUpdate: {
    rate: TaxRate;
    error: {
      code: 'VALIDATE' | 'COLLECTION_NOT_FOUND';
      fields: {
        field: string;
        message: string[];
      }[];
      message: string;
    };
  };
}

export interface UpdateTaxOverrideVariables {
  input: {
    collectionId: ID;
    country: string;
    rate: number;
  };
}

export interface CollectionCrossingResult {
  collectionHasCrossingProduct: {
    hasCommonProducts: boolean;
    error: {
      message: string;
    };
  };
}

export interface CollectionCrossingInfo {
  id: ID;
  hasCommonProducts: boolean;
}

export interface CollectionsCrossingResult {
  collectionsHasCrossingProduct: {
    info: CollectionCrossingInfo[];
    error: {
      message: string;
    };
  };
}

export interface CollectionCrossingInput {
  id: ID;
}

export interface CountryFormValues {
  countryTax?: string;
  digitalTax?: string;
}

export interface TaxOverridePopupFormValues {
  collectionId?: string;
  collectionName?: string;
  collectionTax?: string;
}

export interface UrlParams {
  country: string;
}
