import { useHistory, useParams } from 'react-router-dom';
import { useFormikContext } from 'formik';
import useCountryOptions from 'hooks/useCountryOptions';
import { useTranslation } from 'react-i18next';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { StoreSettingsRoutes } from 'const';
import useFormikFieldError from 'hooks/useFormikFieldError';
import { TaxOverride } from 'types';
import { useMutation } from 'graphql-hooks';
import { DELETE_TAX_RATE, UPDATE_TAX_RATE } from 'api';
import useNotifications from 'hooks/useNotifications';
import {
  CountryFormValues,
  DeleteTaxRateMutationResponseData,
  DeleteTaxRateMutationVariables,
  UpdateTaxRateMutationResponseData,
  UpdateTaxRateMutationVariables,
  UrlParams,
} from 'pages/StoreSettings/pages/Taxes/pages/Country/types';
import { COUNTRY_TAX, DIGITAL_TAX } from 'pages/StoreSettings/pages/Taxes/pages/Country/const';

import { Mode } from '../../AddEditTaxOverridePopup/types';

const useCountryForm = () => {
  const { country } = useParams<UrlParams>();
  const [popupMode, setPopupMode] = useState<Mode>();
  const [editableTaxOverride, setEditableTaxOverride] = useState<TaxOverride>();
  const [isDefaultTaxRate, setIsDefaultTaxRate] = useState(false);
  const { showSuccess, showError } = useNotifications();

  const { values, handleSubmit, handleChange, handleBlur, errors, touched, dirty, setFieldValue } =
    useFormikContext<CountryFormValues>();

  const getError = useFormikFieldError<CountryFormValues>();
  const { countryCodesMap } = useCountryOptions();
  const history = useHistory();
  const { t } = useTranslation();
  const countryName = useMemo<string>(() => countryCodesMap[country], [country, countryCodesMap]);
  const showTaxesListPage = useCallback(() => history.push(StoreSettingsRoutes.TAXES), [history]);

  const handleClickEditIcon = (t: TaxOverride) => {
    setEditableTaxOverride(t);
    setPopupMode('edit');
  };

  const handleCloseTaxOverridePopup = useCallback(() => {
    setEditableTaxOverride(undefined);
    setPopupMode(undefined);
  }, []);

  const handleClickAddTaxOverride = useCallback(() => {
    setEditableTaxOverride(undefined);
    setPopupMode('add');
  }, []);

  const [deleteTaxRate] = useMutation<DeleteTaxRateMutationResponseData, DeleteTaxRateMutationVariables>(
    DELETE_TAX_RATE,
  );

  const [updateTaxRate] = useMutation<UpdateTaxRateMutationResponseData, UpdateTaxRateMutationVariables>(
    UPDATE_TAX_RATE,
  );

  const handleResetTaxRate = useCallback(async () => {
    try {
      const { data, error } = await deleteTaxRate({
        variables: {
          input: {
            country,
          },
        },
      });

      if (data?.taxRateDelete.error) {
        throw data?.taxRateDelete.error.message;
      }

      if (error || !data) {
        throw error;
      }

      setFieldValue(COUNTRY_TAX, data?.taxRateDelete.rate.rate);
      setIsDefaultTaxRate(true);
      showSuccess(t('taxes_for_country_were_updated'));
    } catch (error) {
      showError(t('error'));
    }
  }, [country, deleteTaxRate, setFieldValue, showError, showSuccess, t]);

  const handleResetDigitalTaxRate = useCallback(async () => {
    const rate = Number(values[COUNTRY_TAX] ?? 0);

    try {
      const { data, error } = await updateTaxRate({
        variables: {
          input: { country, rate: Number(rate.toFixed(2)), digitalRate: 0 },
        },
      });

      if (data?.taxRateUpdate.error) {
        throw data?.taxRateUpdate.error.message;
      }

      if (error || !data) {
        throw error;
      }

      setFieldValue(DIGITAL_TAX, 0);
      setIsDefaultTaxRate(true);
      showSuccess(t('taxes_for_country_were_updated'));
    } catch (error) {
      showError(t('error'));
    }
  }, [country, values, updateTaxRate, setFieldValue, showError, showSuccess, t]);

  const handleChangeWithDefaultSetter = useCallback((e: ChangeEvent) => {
    if (isDefaultTaxRate) {
      setIsDefaultTaxRate(false);
    }

    handleChange(e);
  }, [handleChange, isDefaultTaxRate]);

  return {
    countryName,
    t,
    handleResetTaxRate,
    handleResetDigitalTaxRate,
    showTaxesListPage,
    values,
    handleSubmit,
    handleChange: handleChangeWithDefaultSetter,
    handleBlur,
    errors,
    touched,
    dirty,
    getError,
    popupMode,
    setPopupMode,
    handleClickEditIcon,
    handleCloseTaxOverridePopup,
    handleClickAddTaxOverride,
    editableTaxOverride,
    isDefaultTaxRate,
  };
};

export default useCountryForm;
