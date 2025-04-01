import { useCallback, useMemo } from 'react';
import { useMutation } from 'graphql-hooks';
import { useTranslation } from 'react-i18next';
import { DISABLE_TAX_CALCULATION, ENABLE_TAX_CALCULATION, GET_TAX_RATES } from 'api';
import usePaginationState from 'hooks/usePaginationState';
import useCountryOptions from 'hooks/useCountryOptions';
import useActiveStore from 'hooks/useActiveStore';
import useToggleState from 'hooks/useToggleState';
import useNotifications from 'hooks/useNotifications';
import useSortOptions from 'hooks/useSortOptions';
import { TaxRate } from 'types';
import { TABLE_NUMBER_ENTITY } from 'const';

import { DisableMutationResult, EnableMutationResult } from './types';
import { taxSortOptions } from './const';
import useInitTableState from './useInitTableState';
import getVariables from './lib/getVariables';
import getInitFilter from './lib/getInitFilter';

const useCountries = () => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotifications();
  const [enableTaxCalculation] = useMutation<EnableMutationResult>(ENABLE_TAX_CALCULATION);
  const [disableTaxCalculation] = useMutation<DisableMutationResult>(DISABLE_TAX_CALCULATION);
  const [disablePopupOpen, toggleDisablePopupOpen] = useToggleState();
  const [enablePopupOpen, toggleEnablePopupOpen] = useToggleState();
  const { activeStore, refetch: refetchStore } = useActiveStore();
  const { countryCodesMap } = useCountryOptions();
  const initTableState = useInitTableState();
  const { options: sortOptions } = useSortOptions(taxSortOptions);

  const {
    entities,
    loading,
    hasNext,
    hasPrevious,
    tableState,
    onTableStateChange,
    onPaginationClick,
    refetch,
  } = usePaginationState<TaxRate>({
    entitiesName: 'taxRates',
    fetchQuery: GET_TAX_RATES,
    initTableState,
    mapStateToVariables: getVariables,
  });

  const hasPagination =
    !!entities &&
    !(entities.length <= TABLE_NUMBER_ENTITY && !hasPrevious && !hasNext);

  const taxRates = useMemo(
    () => entities?.map(e => ({ ...e, country: countryCodesMap[e.country] })),
    [countryCodesMap, entities],
  );

  const handleDisable = useCallback(async () => {
    try {
      const { data, error } = await disableTaxCalculation();

      if (!data?.taxCalculationDisable) {
        throw new Error('Update error');
      }

      if (data?.taxCalculationDisable.error) {
        throw new Error(data.taxCalculationDisable.error.message);
      }

      if (error) throw error;

      showSuccess(t('tax_calc_was_changed'));
      await refetchStore();
      toggleDisablePopupOpen();
    } catch {
      showError(t('errors.updating_error'));
    }
  }, [
    disableTaxCalculation,
    refetchStore,
    showError,
    showSuccess,
    t,
    toggleDisablePopupOpen,
  ]);

  const handleEnable = useCallback(async () => {
    try {
      const { data, error } = await enableTaxCalculation();

      if (!data?.taxCalculationEnable) {
        throw new Error('Update error');
      }

      if (data?.taxCalculationEnable.error) {
        throw new Error(data.taxCalculationEnable.error.message);
      }

      if (error) throw error;

      showSuccess(t('tax_calc_was_changed'));
      await refetchStore();
      toggleEnablePopupOpen();
    } catch {
      showError(t('errors.updating_error'));
    }
  }, [
    enableTaxCalculation,
    showSuccess,
    t,
    refetchStore,
    toggleEnablePopupOpen,
    showError,
  ]);

  const taxCollected = Boolean(activeStore?.automaticTaxCalculation);

  const handleToggle = useCallback(() => {
    if (taxCollected) {
      toggleDisablePopupOpen();
    } else {
      toggleEnablePopupOpen();
    }
  }, [taxCollected, toggleDisablePopupOpen, toggleEnablePopupOpen]);

  return {
    taxRates,
    initTableState,
    tableState,
    sortOptions,
    taxCollected,
    loading,
    hasNext,
    hasPrevious,
    hasPagination,
    enablePopupOpen,
    disablePopupOpen,
    refetch,
    getInitFilter,
    onTableStateChange,
    onPaginationClick,
    handleEnable,
    handleDisable,
    handleToggle,
    toggleEnablePopupOpen,
    toggleDisablePopupOpen,
  };
};

export default useCountries;
