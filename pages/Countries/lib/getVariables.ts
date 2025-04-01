import { TableState, OptionType } from 'types';
import { REVERSE } from 'const';

import { SEPARATOR, keysMap } from '../const';

const getVariables = (values: TableState) => {
  const { filter: status, query: search, sort } = values;
  const [{ value }] = sort;
  const sortKey = value.split(SEPARATOR)[0];
  const reverse = value.endsWith(REVERSE);
  const acc = { ...!!search && { search } } as Record<string, string[] | string>;
  
  const filter = Object.entries(status as Record<string, [OptionType]>)
    .filter(entry => entry[1]?.length)
    .reduce((acc, [currentKey, option]) => {
      if (option[0].value === 'reset') {
        return acc;
      }

      const newKey = keysMap[currentKey as keyof typeof keysMap];
      acc[newKey] = [option[0].value];

      return acc;
    }, acc as Record<string, string[] | Record<string, number> | string>);

  return { sortKey, reverse, filter };
};

export default getVariables;
