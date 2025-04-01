import React, { lazy, memo, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Loader, LayoutHeader } from '@unistorecom/ui';
import { StoreSettingsRoutes } from 'const';
import UnistoreOnboarding from 'pages/components/UnistoreOnboarding';

import useTaxes from './useTaxes';

const CountriesPage = lazy(() => import('./pages/Countries'));
const CountryPage = lazy(() => import('./pages/Country'));

const Taxes = () => {
  const { onExit, t } = useTaxes();

  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        <Route path={`${StoreSettingsRoutes.TAXES}/:country`}>
          <LayoutHeader title={t('routes.taxes')} onBack={onExit} />
          <CountryPage />
        </Route>
        <Route>
          <CountriesPage />
          <UnistoreOnboarding />
        </Route>
      </Switch>
    </Suspense>
  );
};

export default memo(Taxes);
