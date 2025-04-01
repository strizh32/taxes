import { OptionType } from 'types';

import { taxFilterOptions } from '../const';

type Filter = OptionType[] | Record<string, OptionType[] | []>;

const checkFilterAll = (filter?: Filter) => {
  return filter && 'All' in filter && filter.All[0]?.value === taxFilterOptions[0].value;
};

export default checkFilterAll;
