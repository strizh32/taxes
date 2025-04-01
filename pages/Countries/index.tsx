import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { DeletePopup } from '@unistorecom/ui';
import { StoreSettingsRoutes } from 'const';
import TableContent from 'components/TableContent';
import ListPageWrapper from 'components/ListPageWrapper';
import ConfirmPopup from 'components/ConfirmPopup';

import Header from './components/Header';
import CountriesTable from './components/CountriesTable';
import useCountries from './useCountries';
import styles from './styles.module.scss';

const Countries = () => {
  const { t } = useTranslation();

  const {
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
  } = useCountries();

  const tableContentName = (
    <p className={styles.Countries__EmptyText}>
      <Trans key="dont_have_taxes_info">
        There is no information about taxes yet.
        <br />
        <Link to={StoreSettingsRoutes.DELIVERY_OPTIONS}>Add regions</Link> to
        calculate taxes for them
      </Trans>
    </p>
  );

  return (
    <ListPageWrapper refetch={refetch}>
      <Header
        initTableState={initTableState}
        tableState={tableState}
        sortOptions={sortOptions}
        taxCollected={taxCollected}
        getInitFilter={getInitFilter}
        onTableStateChange={onTableStateChange}
        onToggle={handleToggle}
      />
      <TableContent
        hasPagination={hasPagination}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        onChangePage={onPaginationClick}
        name={tableContentName}
        loading={loading}
        search={false}
        empty={!taxRates?.length && !tableState.query}
      >
        {taxRates && <CountriesTable taxRates={taxRates} />}
        <DeletePopup
          open={disablePopupOpen}
          onClose={toggleDisablePopupOpen}
          onDelete={handleDisable}
          translate={t}
          title={t('stop_charging_vat')}
          description={t('sure_to_stop_charge_vat')}
          deleteText={t('confirm')}
        />
        <ConfirmPopup
          open={enablePopupOpen}
          onCancel={toggleEnablePopupOpen}
          onConfirm={handleEnable}
          title={t('start_charging_vat')}
          description={t('sure_to_start_charge_vat')}
        />
      </TableContent>
    </ListPageWrapper>
  );
};

export default memo(Countries);
