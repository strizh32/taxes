import React from 'react';
import { useTranslation } from 'react-i18next';
import { Toggle } from '@unistorecom/ui';
import TableHeader from 'components/TableHeader';
import { OptionType, TableState } from 'types';

import useHeader from './useHeader';
import checkFilterAll from '../../lib/checkFilterAll';
import styles from './styles.module.scss';

export interface Props {
  initTableState: TableState;
  tableState: TableState;
  sortOptions: OptionType[];
  taxCollected: boolean;
  getInitFilter: (filter: Record<string, OptionType[]>) => Record<string, OptionType[]>;
  onTableStateChange: (state: TableState) => void;
  onToggle: () => void;
}

const Header = (props: Props) => {
  const { initTableState, tableState, sortOptions, taxCollected, getInitFilter, onTableStateChange, onToggle } = props;
  const { t } = useTranslation();

  const { 
    filterOptions,
    subMenuScroll,
    sort,
    filter,
    query,
    handleChangeSort,
    handleChangeSearch,
    handleSelectFilter,
    handleMenuOpen,
  } = useHeader({
    initTableState,
    tableState,
    getInitFilter,
    onTableStateChange,
  });

  return (
    <TableHeader
      className={styles.Header}
      title={t('routes.taxes')}
      search={{
        value: query,
        onChange: handleChangeSearch,
      }}
      filter={{
        options: filterOptions,
        onSelect: handleSelectFilter,
        onMenuOpen: handleMenuOpen,
        menuRef: subMenuScroll,
        activeItems: Object.values(filter).flat(),
        badge: !checkFilterAll(filter),
        classes: { list: styles.Header__FilterList },
      }}
      sort={{
        options: sortOptions,
        onSelect: handleChangeSort,
        activeItems: sort,
        badge: sort[0].value !== sortOptions[0].value,
        classes: { list: styles.Header__SortList },
      }}
      actionsPlace="actions"
      actions={(
        <div
          className={styles.Header__ToggleWrapper}
          onClick={onToggle}
        >
          <Toggle
            checked={taxCollected}
            className={styles.Header__Toggle}
            readOnly
          />
          <p className={styles.Header__ToggleLabel}>
            {t('charge_vat')}
          </p>
        </div>
      )}
    />
  );
};

export default Header;
