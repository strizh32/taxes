import React, { memo } from 'react';
import { Button, Popup, PopupShared, InputField, SuggestionField } from '@unistorecom/ui';
import { Trans, useTranslation } from 'react-i18next';
import ConfirmPopup from 'components/ConfirmPopup';
import { TaxOverride } from 'types';

import useAddEditTaxOverride from './useAddEditTaxOverride';
import styles from './styles.module.scss';
import { COLLECTION_ID, COLLECTION_TAX } from '../../const';
import { Mode } from './types';

export interface Props {
  isNotEmptyTaxOverrides: boolean;
  countryName: string;
  resetTaxOverrides: () => void;
  onClose: () => void;
  mode?: Mode;
  taxOverride?: TaxOverride;
}

const { Content, Title, Actions, CloseButton } = PopupShared;

const ZERO = '0.00';
const PERCENT = '%';

const AddEditTaxOverridePopup = (props: Props) => {
  const { resetTaxOverrides, isNotEmptyTaxOverrides, mode, onClose, taxOverride, countryName } = props;

  const {
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
    onContinueConfirmPopup,
    onKnowledgeBase,
    title,
    handleBlurCollectionId,
  } = useAddEditTaxOverride({ resetTaxOverrides, mode, onClose, taxOverride, countryName });

  const { t } = useTranslation();
  const errorMessage = values.collectionName && errors.collectionId ? t(errors.collectionId) : undefined;

  return (
    <>
      <Popup open={!!mode} onClose={onClose} mobileFullScreen>
        <Content>
          <CloseButton onClick={onClose} />
          <Title className={styles.TaxOverridePopup__Title}>{title}</Title>
          <form onSubmit={handleSubmit}>
            <SuggestionField
              className={styles.TaxOverridePopup__SuggestionField}
              label={t('collection')}
              name={COLLECTION_ID}
              value={values.collectionId}
              inputValue={values.collectionName}
              options={options}
              onChange={handleChangeCollectionId}
              onBlur={handleBlurCollectionId}
              translate={t}
              onInputChange={handleInputChange}
              hasMoreOptions={hasMoreCollections}
              loadMoreOptions={loadMoreCollections}
              loading={loadingCollections}
              clearable
              error={errorMessage}
              disabled={loadingUpdateTaxOverride}
            />
            <InputField
              label={t('alternative_tax')}
              placeholder={values.collectionId ? ZERO : t('select_collection_first')}
              name={COLLECTION_TAX}
              value={values.collectionTax}
              error={touched.collectionTax && errors.collectionTax ? t(errors.collectionTax) : undefined}
              slotPrefix={values.collectionId && PERCENT}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!values.collectionId || loadingUpdateTaxOverride}
            />
            <Actions className={styles.TaxOverridePopup__Actions}>
              <Button
                variant="primary"
                loading={loadingUpdateTaxOverride}
                type="submit"
                disabled={!isValid || !dirty}
              >
                {t('save')}
              </Button>
            </Actions>
          </form>
        </Content>
      </Popup>
      <ConfirmPopup
        open={openConfirmPopup && isNotEmptyTaxOverrides}
        title={t('check_product_taxes')}
        description={
          <Trans i18nKey="collection_has_duplicated_products_description">
            The previously added collection already contains products to which tax rates have been applied. The new tax
            rates will be applied to the last added collection.
            <button onClick={onKnowledgeBase()} className={styles.TaxOverridePopup__LinkButton} type="button">
              Learn more
            </button>
          </Trans>
        }
        onConfirm={onContinueConfirmPopup}
        onClose={onContinueConfirmPopup}
        cancelText={t('back')}
        confirmText={t('continue')}
      />
    </>
  );
};

export default memo(AddEditTaxOverridePopup);
