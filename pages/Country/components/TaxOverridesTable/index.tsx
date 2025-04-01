import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableRow,
  TableCell,
  EditIcon,
  DeleteIcon,
  InfoUpIcon,
  IconWrapper,
  DeletePopup,
} from '@unistorecom/ui';
import ShowMoreButton from 'components/ShowMoreButton';
import { ID, TaxOverride } from 'types';
import cn from 'classnames';

import styles from './styles.module.scss';

interface Props {
  taxOverrides: TaxOverride[];
  hasMore: boolean;
  loadMore: () => void;
  loadingTaxOverrides: boolean;
  deletePopupOpen: boolean;
  onClickDeleteIcon: (id: ID) => void;
  onClickEditIcon: (taxOverride: TaxOverride) => void;
  onCloseDeletePopup: () => void;
  onDelete: () => void;
  checkCrossingProductCollection: (id: ID) => boolean;
  collectionNameBeingDeleted?: string;
}

const TaxOverridesTable = (props: Props) => {
  const {
    taxOverrides,
    hasMore,
    loadMore,
    loadingTaxOverrides,
    deletePopupOpen,
    onClickDeleteIcon,
    onClickEditIcon,
    onCloseDeletePopup,
    onDelete,
    checkCrossingProductCollection,
    collectionNameBeingDeleted,
  } = props;

  const { t } = useTranslation();

  const handleEdit = useCallback((taxOverride: TaxOverride) => () => onClickEditIcon(taxOverride), [onClickEditIcon]);
  const handleDelete = useCallback((id: ID) => () => onClickDeleteIcon(id), [onClickDeleteIcon]);

  return (
    <>
      <Table className={styles.TaxOverridesTable}>
        <TableRow head>
          <TableCell className={styles.TaxOverridesTable__LeftCell}>{t('collection')}</TableCell>
          <TableCell className={styles.TaxOverridesTable__CenterCell}>
            <span className={styles.TaxOverridesTable__CenterInnerCell}>{t('alternative_tax')}</span>
          </TableCell>
          <TableCell align="right" className={styles.TaxOverridesTable__RightCell} />
        </TableRow>
        {taxOverrides?.map(taxOverride => (
          <TableRow key={taxOverride.collection.id}>
            <TableCell className={styles.TaxOverridesTable__LeftCell}>
              <div className={styles.TaxOverridesTable__CenterInnerCell}>
                <span className={styles.TaxOverridesTable__Title}>{taxOverride.collection.title}</span>
                {(taxOverrides.length > 1 && checkCrossingProductCollection(taxOverride.collection.id)) && (
                  <IconWrapper className={cn(styles.TaxOverridesTable__Icon, styles.TaxOverridesTable__Icon_info)}>
                    <InfoUpIcon />
                  </IconWrapper>
                )}
              </div>
            </TableCell>
            <TableCell className={styles.TaxOverridesTable__CenterCell}>{taxOverride.rate} %</TableCell>
            <TableCell align="right" className={styles.TaxOverridesTable__RightCell}>
              <IconWrapper onClick={handleEdit(taxOverride)} className={styles.TaxOverridesTable__Icon}>
                <EditIcon />
              </IconWrapper>
              <IconWrapper
                onClick={handleDelete(taxOverride.id)}
                className={cn(styles.TaxOverridesTable__Icon, styles.TaxOverridesTable__Icon_delete)}
              >
                <DeleteIcon />
              </IconWrapper>
            </TableCell>
          </TableRow>
        ))}
      </Table>
      {hasMore && <ShowMoreButton onShowMore={loadMore} loading={loadingTaxOverrides} />}
      <DeletePopup
        open={deletePopupOpen}
        onClose={onCloseDeletePopup}
        onDelete={onDelete}
        translate={t}
        title={t('delete_tax_override')}
        description={t('sure_delete_tax', { name: collectionNameBeingDeleted })}
      />
    </>
  );
};

export default memo(TaxOverridesTable);
