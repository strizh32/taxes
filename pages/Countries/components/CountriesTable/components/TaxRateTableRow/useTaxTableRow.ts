import { useHistory } from 'react-router-dom';
import { SCREEN_SIZE, useMediaQuery } from '@unistorecom/ui';
import { StoreSettingsRoutes } from 'const';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import useCountryOptions from 'hooks/useCountryOptions';

interface Props {
  country: string;
  hasTaxOverrides: boolean;
}

export default (props: Props) => {
  const { country, hasTaxOverrides } = props;
  const history = useHistory();
  const { t } = useTranslation();
  const isDesktop = useMediaQuery(`(min-width: ${SCREEN_SIZE.DESKTOP}) and (hover: hover)`);
  const { countriesMap } = useCountryOptions();

  const prepareRate = (rate: number | null | undefined) => {
    const isEmpty = rate === null || rate === undefined;

    return { isEmpty, value: isEmpty ? '—' : `${rate}%` };
  };

  const handleClickCountry = useCallback(
    () => history.push(`${StoreSettingsRoutes.TAXES}/${countriesMap[country]?.code}`),
    [countriesMap, country, history],
  );

  return {
    isDesktop,
    alternativeTaxesContent: hasTaxOverrides ? t('yes') : t('no'),
    prepareRate,
    handleClickCountry,
  };
};
