import { useCallback, useState } from 'react';
import { OptionType, OptionsGroup, TableState } from 'types';
import useInfiniteScroll from 'hooks/useInfiniteScroll';
import useTableHeaderState from 'hooks/useTableHeaderState';

import { TaxTableState } from './types';
import useFilterOptions from './useFilterOptions';

interface Props {
  initTableState: TableState;
  tableState: TableState;
  getInitFilter: (filter: Record<string, OptionType[]>) => Record<string, OptionType[]>;
  onTableStateChange: (state: TableState) => void;
}

const useHeader = (props: Props) => {
  const { initTableState, tableState, getInitFilter, onTableStateChange } = props;
  const [, setOpenMenu] = useState(false);
  const { options: filterOptions, handleLoadMore } = useFilterOptions();

  const {
    sort,
    filter,
    query,
    handleChangeSort,
    handleChangeFilter,
    handleChangeSearch,
  } = useTableHeaderState({ 
    tableState: tableState as TaxTableState, 
    initTableState: initTableState as TaxTableState,
    onTableStateChange,
    getInitFilter,
  });
  
  const loadMore = () => {
    handleLoadMore();
  };

  const subMenuScroll = useInfiniteScroll(loadMore);

  const handleMenuOpen = (open: boolean) => {
    setOpenMenu(open);
  };

  const handleSelectFilter = useCallback((option: OptionType, group?: OptionsGroup) => {
    handleChangeFilter(option, group);
  }, [handleChangeFilter]);

  return {
    sort,
    filterOptions,
    filter,
    query,
    subMenuScroll,
    handleChangeSort,
    handleSelectFilter,
    handleChangeSearch,
    handleMenuOpen,
  };
};

export default useHeader;
