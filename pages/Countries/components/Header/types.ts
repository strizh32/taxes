import { OptionType, TableState } from 'types';

export interface TaxTableState extends Omit<TableState, 'filter'> {
  filter: Record<string, OptionType[]>;
}
