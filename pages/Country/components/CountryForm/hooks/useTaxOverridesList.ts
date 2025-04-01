import { useCallback, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from 'graphql-hooks';
import { DELETE_TAX_OVERRIDE, GET_TAX_OVERRIDES, COLLECTIONS_HAS_CROSSING_PRODUCT } from 'api';
import { ID, TaxOverride } from 'types';
import useNotifications from 'hooks/useNotifications';
import useToggleState from 'hooks/useToggleState';
import useAllEntities from 'hooks/useAllEntities';
import {
  DeleteTaxOverrideResponseData,
  DeleteTaxOverrideVariables,
  UrlParams,
  CollectionsCrossingResult,
} from 'pages/StoreSettings/pages/Taxes/pages/Country/types';

import { TAX_OVERRIDES_PER_PAGE_COUNT } from '../const';

const ENTITY_NAME = 'taxOverrides';

const useTaxOverridesList = () => {
  const { country } = useParams<UrlParams>();
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotifications();

  const {
    hasMore: hasMoreTaxOverrides,
    reset: resetTaxOverrides,
    loadMore: loadMoreTaxOverrides,
    entities: taxOverrides,
    loading: loadingTaxOverrides,
  } = useAllEntities<TaxOverride>({
    entity: ENTITY_NAME,
    query: GET_TAX_OVERRIDES,
    filter: {
      countries: [country],
    },
    first: TAX_OVERRIDES_PER_PAGE_COUNT,
    search: '',
  });

  const [deletePopupOpen, toggleDeletePopupOpen] = useToggleState();
  const [taxOverrideBeingDeleted, setTaxOverrideBeingDeleted] = useState<ID | null>(null);

  const collectionNameBeingDeleted =
    taxOverrideBeingDeleted ?
      taxOverrides.find(item => item.id === taxOverrideBeingDeleted)?.collection.title :
      '';

  const [deleteTaxOverride] = useMutation<DeleteTaxOverrideResponseData, DeleteTaxOverrideVariables>(
    DELETE_TAX_OVERRIDE,
  );

  const { data } = useQuery<CollectionsCrossingResult>(COLLECTIONS_HAS_CROSSING_PRODUCT, {
    variables: { ids: taxOverrides.map(tax => tax.collection.id) },
    refetchAfterMutations: [DELETE_TAX_OVERRIDE],
  });

  const crossingProductCollections = useMemo(() => {
    return data?.collectionsHasCrossingProduct?.info.reduce(
      (acc, item) => [...acc, ...(item.hasCommonProducts ? [item.id] : [])],
      [] as ID[],
    ) ?? [];
  }, [data]);

  const hasCrossingProductCollection = data?.collectionsHasCrossingProduct?.info.some(
    item => item.hasCommonProducts,
  ) ?? false;

  const checkCrossingProductCollection = useCallback(
    (id: ID) => (crossingProductCollections || []).includes(id),
    [crossingProductCollections],
  );

  const handleClickDeleteIcon = useCallback(
    (id: ID) => {
      setTaxOverrideBeingDeleted(id);
      toggleDeletePopupOpen();
    },
    [toggleDeletePopupOpen],
  );

  const handleCloseDeletePopup = useCallback(() => {
    setTaxOverrideBeingDeleted(null);
    toggleDeletePopupOpen();
  }, [toggleDeletePopupOpen]);

  const handleDelete = useCallback(async () => {
    if (!taxOverrideBeingDeleted) return;

    try {
      const { data, error } = await deleteTaxOverride({
        variables: {
          input: {
            id: taxOverrideBeingDeleted,
          },
        },
      });

      if (data?.taxOverrideDelete.error) {
        throw data?.taxOverrideDelete.error.message;
      }

      if (!data || error) {
        throw error;
      }

      toggleDeletePopupOpen();
      showSuccess(t('taxes_for_country_were_updated'));
      resetTaxOverrides();
    } catch (error) {
      showError(t('error'));
    }
  }, [deleteTaxOverride, resetTaxOverrides, showError, showSuccess, t, taxOverrideBeingDeleted, toggleDeletePopupOpen]);

  return {
    taxOverrides,
    hasMoreTaxOverrides,
    hasCrossingProductCollection,
    checkCrossingProductCollection,
    loadMoreTaxOverrides,
    loadingTaxOverrides,
    deletePopupOpen,
    handleClickDeleteIcon,
    handleCloseDeletePopup,
    handleDelete,
    resetTaxOverrides,
    collectionNameBeingDeleted,
  };
};

export default useTaxOverridesList;
