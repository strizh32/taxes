import { useQuery } from 'graphql-hooks';
import { GET_ALL_FILTERED_SHIPPING_REGIONS } from 'api/shippingRules';
import { Edge, EntityError, OptionType, ShippingRegionId } from 'types';
import { ShippingRegionErrorCode } from 'const';
import useTranslateOptions from 'hooks/useTranslateOptions';
import { useState } from 'react';

import { taxFilterOptions } from '../../const';

interface QueryResult {
  shippingRegions: {
    totalCount: number;
    edges: Edge<ShippingRegionId>[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  },
  error: EntityError<keyof typeof ShippingRegionErrorCode>,
}

const SIZE = 10;

const useFilterOptions = () => {
  const [after, setAfter] = useState<string>();
  
  const { data, loading, refetch } = useQuery<QueryResult>(GET_ALL_FILTERED_SHIPPING_REGIONS, {
    variables: {
      after,
      first: SIZE,
    },
    updateData: (prev: QueryResult, next: QueryResult) => ({
      ...next,
      shippingRegions: {
        ...next.shippingRegions,
        edges: after
          ? [...prev.shippingRegions.edges, ...next.shippingRegions.edges]
          : next.shippingRegions.edges,
      },
    }),
    skipCache: true,
  });

  const regionOptions = 
    data?.shippingRegions.edges.map(({ node }) => ( { 'value': node.id, 'label': node.title })) as [OptionType] || [];

  const handleLoadMore = () => {
    const length = data?.shippingRegions.edges.length;

    if (length) {
      const cursor = data?.shippingRegions.edges[length - 1]?.cursor;

      if (cursor) setAfter(cursor);
    }
  };
  
  const options = useTranslateOptions(taxFilterOptions).map( filter => {
    if ('options' in filter) {
      filter.options = regionOptions;
    }
    
    return filter;
  });

  return {
    refetch,
    options,
    loading,
    handleLoadMore,
  };
};

export default useFilterOptions;
