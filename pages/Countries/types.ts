import { TaxBasis } from 'types';

export interface DisableMutationResult {
  taxCalculationDisable: {
    error: {
      message: string;
    };
  };
}

export interface EnableMutationResult {
  taxCalculationEnable: {
    source: TaxBasis;
    error: {
      message: string;
    };
  };
}
