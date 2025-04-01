import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableRow,
  TableCell,
  useMediaQuery,
  SCREEN_SIZE,
} from '@unistorecom/ui';
import { TaxRate } from 'types';
import EmptyList from 'components/EmptyList';

import styles from './styles.module.scss';
import TaxRateTableRow from './components/TaxRateTableRow';

export interface Props {
  taxRates: TaxRate[];
}

const CountriesTable = (props: Props) => {
  const { taxRates } = props;
  const { t } = useTranslation();
  const isDesktop = useMediaQuery(`(min-width: ${SCREEN_SIZE.DESKTOP}) and (hover: hover)`);
  
  return (
    <Table className={styles.CountriesTable}>
      {isDesktop && (
        <TableRow head className={!taxRates.length ? styles.CountriesTable_hasBottomBorder : ''}>
          <TableCell>{t('country')}</TableCell>
          <TableCell>{t('country_vat')}</TableCell>
          <TableCell>{t('digital_products_vat')}</TableCell>
          <TableCell>{t('region')}</TableCell>
          <TableCell>{t('alternative_taxes')}</TableCell>
          <TableCell inline className={styles.CountriesTable__ActionCell} />
        </TableRow>
      )}
      {!taxRates.length && <EmptyList name="" search/>}
      {taxRates.map(taxRate => (
        <TaxRateTableRow key={taxRate.country} taxRate={taxRate} />
      ))}
    </Table>
  );
};

export default memo(CountriesTable);
