import React, { memo } from 'react';
import { Trans } from 'react-i18next';
import {
  EditPageShared,
  InfoUpIcon,
  InputField,
  Grid,
  IconWrapper,
  Button,
  Tooltip,
  Breadcrumbs,
} from '@unistorecom/ui';
import { StartOverIcon } from 'assets/icons';
import useLayoutActions from 'hooks/useLayoutActions';

import useCountryForm from './hooks/useCountryForm';
import useTaxOverridesList from './hooks/useTaxOverridesList';
import AddEditTaxOverridePopup from '../AddEditTaxOverridePopup';
import TaxOverridesTable from '../TaxOverridesTable';
import { COUNTRY_TAX, DIGITAL_TAX } from '../../const';
import styles from './styles.module.scss';

const ALTERNATIVE_TAX_KNOWLEDGE_BASE_URL = '/topics/store-settings/taxes#alternative-tax';

const { Title, Legend, Footer, Form } = EditPageShared;
const { Row, Col } = Grid;

const CountryForm = () => {
  const { onKnowledgeBase } = useLayoutActions();

  const {
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
  } = useTaxOverridesList();

  const {
    countryName,
    t,
    handleResetTaxRate,
    handleResetDigitalTaxRate,
    showTaxesListPage,
    values,
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    dirty,
    getError,
    popupMode,
    editableTaxOverride,
    handleClickEditIcon,
    handleCloseTaxOverridePopup,
    handleClickAddTaxOverride,
    isDefaultTaxRate,
  } = useCountryForm();

  const defaultDigitalTaxInputClassName = values[DIGITAL_TAX] === '0' ? styles.CountryForm__Input_default : undefined;

  return (
    <Form onSubmit={handleSubmit} className={styles.CountryForm}>
      <Breadcrumbs className={styles.CountryForm__Breadcrumbs}>
        <span onClick={showTaxesListPage} className={styles.CountryForm__BreadcrumbsRootItem}>
          {t('taxes')}
        </span>
        <span className={styles.CountryForm__BreadcrumbsCurrentItem}>{countryName}</span>
      </Breadcrumbs>
      <Title>{countryName}</Title>
      <Row gap="24px">
        <Col lg={4} sm={6}>
          <Legend className={styles.CountryForm__Legend}>{t('base_taxes')}</Legend>
          <p className={styles.CountryForm__Description}>{t('use_base_taxes', { country: countryName })}</p>
        </Col>
      </Row>
      <Row gap="24px">
        <Col lg={4} sm={6}>
          <InputField
            className={styles.CountryForm__TaxInputField}
            label={t('country_vat')}
            name={COUNTRY_TAX}
            value={values[COUNTRY_TAX]}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched[COUNTRY_TAX] ? getError(COUNTRY_TAX) : undefined}
            slotPrefix={<div className={styles.CountryForm__Prefix}>%</div>}
            slotPostfix={
              <Tooltip title={t('reset_to_default_tax_rate')}>
                <IconWrapper className={styles.CountryForm__InputIcon} onClick={handleResetTaxRate}>
                  <StartOverIcon />
                </IconWrapper>
              </Tooltip>
            }
          />
        </Col>
        <Col lg={4} sm={6}>
          <InputField
            className={styles.CountryForm__TaxInputField}
            classes={{ input: defaultDigitalTaxInputClassName }}
            label={t('digital_products_vat')}
            name={DIGITAL_TAX}
            value={values[DIGITAL_TAX]}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched[DIGITAL_TAX] ? getError(DIGITAL_TAX) : undefined}
            slotPrefix={<div className={styles.CountryForm__Prefix}>%</div>}
            slotPostfix={
              <Tooltip title={t('reset_to_default_tax_rate')}>
                <IconWrapper className={styles.CountryForm__InputIcon} onClick={handleResetDigitalTaxRate}>
                  <StartOverIcon />
                </IconWrapper>
              </Tooltip>
            }
          />
        </Col>
      </Row>
      <Row gap="24px">
        <Col lg={4} sm={6}>
          <Legend className={styles.CountryForm__Legend}>{t('alternative_taxes')}</Legend>
          <p className={styles.CountryForm__Description}>{t('set_up_regional_tax_rates')}</p>
          <Button className={styles.CountryForm__AddButton} onClick={handleClickAddTaxOverride} type="button">
            {t('add')}
          </Button>
        </Col>
      </Row>
      {taxOverrides.length !== 0 && (
        <>
          <TaxOverridesTable
            taxOverrides={taxOverrides}
            loadingTaxOverrides={loadingTaxOverrides}
            onDelete={handleDelete}
            deletePopupOpen={deletePopupOpen}
            onCloseDeletePopup={handleCloseDeletePopup}
            onClickDeleteIcon={handleClickDeleteIcon}
            onClickEditIcon={handleClickEditIcon}
            hasMore={hasMoreTaxOverrides}
            loadMore={loadMoreTaxOverrides}
            collectionNameBeingDeleted={collectionNameBeingDeleted}
            checkCrossingProductCollection={checkCrossingProductCollection}
          />
          {(hasCrossingProductCollection && taxOverrides.length > 1) && (
            <div className={styles.CountryForm__TableDesc}>
              <InfoUpIcon className={styles.CountryForm__InfoIcon} />
              <Trans i18nKey="alternative_taxes_collections_has_crossing_product" transWrapTextNodes="span">
                There are duplicated products from other collections with another tax applied. 
                <span
                  className={styles.CountryForm__Link}
                  onClick={onKnowledgeBase(ALTERNATIVE_TAX_KNOWLEDGE_BASE_URL)}
                >
                  Learn more
                </span>
              </Trans>
            </div>
          )}
        </>
      )}
      <Footer>
        <Button
          variant="outlined"
          type="button"
          className={styles.CountryForm__CancelButton}
          onClick={showTaxesListPage}
        >
          {t('cancel')}
        </Button>
        <Button variant="primary" type="submit" disabled={!dirty || isDefaultTaxRate}>
          {t('save')}
        </Button>
      </Footer>
      <AddEditTaxOverridePopup
        mode={popupMode}
        isNotEmptyTaxOverrides={taxOverrides.length > 1}
        onClose={handleCloseTaxOverridePopup}
        resetTaxOverrides={resetTaxOverrides}
        taxOverride={editableTaxOverride}
        countryName={countryName}
      />
    </Form>
  );
};

export default memo(CountryForm);
