import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { TableCell, TableRow, IconWrapper, EditIcon, ArrowForwardIcon, MobileTableCell } from '@unistorecom/ui';
import { TaxRate } from 'types';
import cn from 'classnames';

import useTaxTableRow from './useTaxTableRow';
import styles from './style.module.scss';

interface Props {
  taxRate: TaxRate;
}

const TaxRateTableRow = (props: Props) => {
  const { taxRate } = props;
  const { t } = useTranslation();
  const { country, rate, digitalRate, region, hasTaxOverrides } = taxRate;

  const {
    isDesktop,
    alternativeTaxesContent,
    prepareRate,
    handleClickCountry,
  } = useTaxTableRow({ country, hasTaxOverrides });

  const componentClass = cn(styles.TableRow, !isDesktop && styles.TableRow_mobile);
  const preparedRate = prepareRate(rate);
  const preparedDigitalRate = prepareRate(digitalRate);

  return (
    <TableRow key={country} className={componentClass} onClick={handleClickCountry}>
      {isDesktop ? (
        <>
          <TableCell>{country}</TableCell>
          <TableCell className={cn(styles.TableRow__Rate, preparedRate.isEmpty && styles.TableRow__Rate_empty)}>
            {preparedRate.value}
          </TableCell>
          <TableCell className={cn(styles.TableRow__Rate, preparedDigitalRate.isEmpty && styles.TableRow__Rate_empty)}>
            {preparedDigitalRate.value}
          </TableCell>
          <TableCell>{region}</TableCell>
          <TableCell>{alternativeTaxesContent}</TableCell>
          <TableCell inline className={styles.TableRow__ActionCell}>
            <IconWrapper>
              <EditIcon className={styles.TableRow__EditIcon} />
              <ArrowForwardIcon className={styles.TableRow__ArrowIcon} />
            </IconWrapper>
          </TableCell>
        </>
      ) : (
        <div className={styles.TableRow__MobileContent}>
          <MobileTableCell title={country} />
          <MobileTableCell label={t('country_vat')} content={preparedRate.value} />
          <MobileTableCell label={t('digital_products_vat')} content={preparedDigitalRate.value} />
          <MobileTableCell label={t('region')} content={region} />
          <MobileTableCell label={t('alternative_taxes')} content={alternativeTaxesContent} />
        </div>
      )}
    </TableRow>
  );
};

export default memo(TaxRateTableRow);
