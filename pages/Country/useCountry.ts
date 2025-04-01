import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import useNotifications from 'hooks/useNotifications';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'graphql-hooks';
import { DELETE_TAX_RATE, GET_TAX_RATES, UPDATE_TAX_RATE } from 'api';

import {
  CountryFormValues,
  TaxRatesQueryResult,
  UpdateTaxRateMutationResponseData,
  UpdateTaxRateMutationVariables,
  UrlParams,
} from './types';
import { COUNTRY_TAX, DIGITAL_TAX } from './const';

const useCountry = () => {
  const { country } = useParams<UrlParams>();
  const { showSuccess, showError } = useNotifications();
  const { t } = useTranslation();

  const { data: taxRatesData, refetch: refetchCurrentTaxRate } = useQuery<TaxRatesQueryResult>(GET_TAX_RATES, {
    variables: {
      filter: {
        countries: [country],
      },
    },
    refetchAfterMutations: [DELETE_TAX_RATE],
  });

  const [updateTaxRate] = useMutation<UpdateTaxRateMutationResponseData, UpdateTaxRateMutationVariables>(
    UPDATE_TAX_RATE,
  );

  const handleSubmit = useCallback(
    async (values: CountryFormValues) => {
      const rate = Number(values[COUNTRY_TAX] ?? 0);
      const digitalRate = Number(values[DIGITAL_TAX] ?? 0);

      try {
        const { data, error } = await updateTaxRate({
          variables: {
            input: {
              rate: Number(rate.toFixed(2)),
              digitalRate: Number(digitalRate.toFixed(2)),
              country,
            },
          },
        });

        if (data?.taxRateUpdate.error) {
          throw data?.taxRateUpdate.error.code;
        }

        if (error || !data) {
          throw error;
        }

        await refetchCurrentTaxRate();
        showSuccess(t('taxes_for_country_were_updated'));
      } catch (error) {
        showError(t('error'));
      }
    },
    [country, refetchCurrentTaxRate, showError, showSuccess, t, updateTaxRate],
  );

  const { rate, digitalRate } = taxRatesData?.taxRates.edges?.[0].node || {};

  const initialValues: CountryFormValues = {
    countryTax: (rate ?? '0').toString(),
    digitalTax: (digitalRate ?? '0').toString(),
  };

  return {
    initialValues,
    refetch: refetchCurrentTaxRate,
    handleSubmit,
  };
};

export default useCountry;
