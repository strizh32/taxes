import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useNotifications from 'hooks/useNotifications';
import { Collection, OptionType, TaxOverride } from 'types';
import { COLLECTION_HAS_CROSSING_PRODUCT, GET_FILTERED_COLLECTIONS, GET_TAX_OVERRIDES, UPDATE_TAX_OVERRIDE } from 'api';
import useToggleState from 'hooks/useToggleState';
import { useCallback, useEffect, useMemo } from 'react';
import { useManualQuery, useMutation, useQuery } from 'graphql-hooks';
import { useFormik } from 'formik';
import useLayoutActions from 'hooks/useLayoutActions';
import useAllEntities from 'hooks/useAllEntities';
import { useDebounce } from '@unistorecom/ui';
import {
  CollectionCrossingInput,
  CollectionCrossingResult,
  TaxOverridePopupFormValues,
  TaxOverridesQueryResult,
  UpdateTaxOverrideResponseData,
  UpdateTaxOverrideVariables,
  UrlParams,
} from 'pages/StoreSettings/pages/Taxes/pages/Country/types';
import { COLLECTIONS_PER_PAGE_COUNT } from 'pages/StoreSettings/pages/Taxes/pages/Country/components/CountryForm/const';
import { validateTaxOverride } from 'pages/StoreSettings/pages/Taxes/pages/Country/validate';
import { COLLECTION_ID, COLLECTION_NAME, COLLECTION_TAX } from 'pages/StoreSettings/pages/Taxes/pages/Country/const';

import { Mode } from './types';

interface Props {
  countryName: string;
  resetTaxOverrides: () => void;
  onClose: () => void;
  mode?: Mode;
  taxOverride?: TaxOverride;
}

const TIMEOUT = 300;
const ENTITY_NAME = 'collections';

const useAddEditTaxOverride = (props: Props) => {
  const { resetTaxOverrides, mode, onClose, taxOverride, countryName } = props;
  const { country } = useParams<UrlParams>();
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotifications();
  const { onKnowledgeBase } = useLayoutActions();
  const editMode = mode === 'edit';
  const [openConfirmPopup, , setOpenConfirmPopup] = useToggleState();

  const [updateTaxOverride, { loading: loadingUpdateTaxOverride }] = useMutation<
    UpdateTaxOverrideResponseData,
    UpdateTaxOverrideVariables
  >(UPDATE_TAX_OVERRIDE);

  const [checkCollectionCrossing] = useManualQuery<CollectionCrossingResult, CollectionCrossingInput>(
    COLLECTION_HAS_CROSSING_PRODUCT,
  );

  const getCollectionHasCrossingProduct = async (collectionId: string) => {
    try {
      const { data, error } = await checkCollectionCrossing({
        variables: {
          id: collectionId,
        },
      });

      if (data?.collectionHasCrossingProduct.error) {
        throw new Error(data.collectionHasCrossingProduct.error.message);
      }

      if (error || !data) {
        throw error;
      }

      return data.collectionHasCrossingProduct;
    } catch (error) {
      showError(t('error'));
    }
  };

  const handleUpdateTaxOverride = async (values: TaxOverridePopupFormValues) => {
    if (!values.collectionId) return;

    const rate = Number(values.collectionTax) ?? 0;

    try {
      const { data, error } = await updateTaxOverride({
        variables: {
          input: {
            collectionId: values.collectionId,
            country,
            rate: Number(rate.toFixed(2)),
          },
        },
      });

      if (data?.taxOverrideUpdate.error) {
        throw new Error(data.taxOverrideUpdate.error.message);
      }

      if (error || !data) {
        throw error;
      }

      showSuccess(t(editMode ? 'taxes_for_country_were_updated' : 'taxes_for_country_were_added'));
      resetTaxOverrides();
    } catch (error) {
      showError(t('error'));
    }
  };

  const initialValues = useMemo<TaxOverridePopupFormValues>(() => {
    if (!taxOverride) {
      return {
        collectionId: undefined,
        collectionTax: undefined,
        collectionName: '',
      };
    }

    return {
      collectionId: taxOverride.collection.id.toString(),
      collectionTax: taxOverride.rate.toString(),
      collectionName: taxOverride.collection.title,
    };
  }, [taxOverride]);

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    touched,
    isValid,
    dirty,
    resetForm,
    setFieldTouched,
  } = useFormik<TaxOverridePopupFormValues>({
    initialValues,
    enableReinitialize: true,
    validate: validateTaxOverride,
    onSubmit: async values => {
      if (!values.collectionId) return;

      await handleUpdateTaxOverride(values);
      onClose();
      resetForm();

      if (editMode) return;

      const hasCrossing = await getCollectionHasCrossingProduct(values.collectionId);

      if (hasCrossing?.hasCommonProducts) {
        setOpenConfirmPopup(true);
      }
    },
  });

  const handleBlurCollectionId = () => {
    if (touched[COLLECTION_ID]) return;

    setFieldTouched(COLLECTION_ID, true);
  };

  const debouncedTitle = useDebounce(values.collectionName ?? '', TIMEOUT);

  const {
    hasMore: hasMoreCollections,
    loadMore: loadMoreCollections,
    entities: collections,
    loading: loadingCollections,
    reset,
  } = useAllEntities<Collection>({
    entity: ENTITY_NAME,
    query: GET_FILTERED_COLLECTIONS,
    filter: {
      taxes: {
        countries: [country],
        hasTaxOverwritten: editMode,
      },
      ...(!!debouncedTitle && { title: debouncedTitle }),
    },
    search: debouncedTitle,
    first: COLLECTIONS_PER_PAGE_COUNT,
    skip: !mode,
  });

  const handleInputChange = useCallback(
    (title: string) => {
      setFieldValue(COLLECTION_NAME, title);
    },
    [setFieldValue],
  );

  const handleChangeCollectionId = useCallback(
    (value?: string) => {
      setFieldValue(COLLECTION_ID, value);
    },
    [setFieldValue],
  );

  const options = useMemo<OptionType[]>(
    () =>
      collections?.map(col => ({
        label: col.title,
        value: col.id.toString(),
      })) ?? [],
    [collections],
  );

  const { data } = useQuery<TaxOverridesQueryResult>(GET_TAX_OVERRIDES, {
    variables: {
      filter: {
        countries: [country],
        collectionIds: [values.collectionId],
      },
    },
    skip: !editMode || !values.collectionId,
  });

  useEffect(() => {
    const taxOverride = data?.taxOverrides?.edges?.[0]?.node;

    if (!editMode || !taxOverride) return;

    setFieldValue(COLLECTION_TAX, taxOverride.rate);
    setFieldValue(COLLECTION_NAME, taxOverride.collection.title);
    setFieldTouched(COLLECTION_TAX, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return {
    loadingUpdateTaxOverride,
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isValid,
    touched,
    dirty,
    hasMoreCollections,
    loadMoreCollections,
    loadingCollections,
    handleInputChange,
    handleChangeCollectionId,
    options,
    openConfirmPopup,
    handleBlurCollectionId,
    onContinueConfirmPopup: () => setOpenConfirmPopup(false),
    reset,
    onKnowledgeBase,
    title: t(editMode ? 'edit_alternative_tax' : 'add_tax_override', { country: countryName }),
  };
};

export default useAddEditTaxOverride;
