import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { StoreSettingsRoutes } from 'const';

const useTaxes = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const onExit = () => history.push(StoreSettingsRoutes.TAXES);

  return { onExit, t };
};

export default useTaxes;
