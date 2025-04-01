import React, { memo } from 'react';
import { Formik } from 'formik';
import PageWrapper from 'components/PageWrapper';

import { validateCountryTax } from './validate';
import CountryForm from './components/CountryForm';
import { CountryFormValues } from './types';
import useCountry from './useCountry';

const Country = () => {
  const { initialValues, refetch, handleSubmit } = useCountry();

  return (
    <PageWrapper refetch={refetch}>
      <Formik<CountryFormValues>
        initialValues={initialValues}
        validate={validateCountryTax}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        <CountryForm />
      </Formik>
    </PageWrapper>
  );
};

export default memo(Country);
