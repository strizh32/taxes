import { OptionType } from 'types';

import { taxFilterOptions } from '../const';

const getInitFilter = (filter: Record<string, OptionType[]>) => {
  const filterKeys = Object.keys(filter);

  return filterKeys.reduce((acc, key) => {
    if (key === 'All') {
      acc[key] = [taxFilterOptions[0] as OptionType];
    } else {
      acc[key] = [];
    }

    return acc;
  }, {} as typeof filter);
};

export default getInitFilter;
