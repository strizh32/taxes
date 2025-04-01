import { useMemo } from 'react';
import { OptionType, TableState } from 'types';
import useSortOptions from 'hooks/useSortOptions';

import { taxFilterOptions, taxSortOptions } from './const';

const useInitTableState = (): TableState => {
  const { options: sortOptions } = useSortOptions(taxSortOptions);

  const initTableState = useMemo(() => ({
    filter: {
      All: [taxFilterOptions[0]] as [OptionType],
      Region: [],
    },
    sort: [sortOptions[0]] as [OptionType],
    query: '',
  }), [sortOptions]);

  return initTableState;
};

export default useInitTableState;
