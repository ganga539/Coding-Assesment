import React from 'react';
import { Query } from 'urql';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const query = 'query {getMetrics}';

const animatedComponents = makeAnimated();

type EventType = {
  value: string;
  label: string;
};

type Proptypes = {
  setMetrics: any;
};

export default (props: Proptypes) => {
  const { setMetrics } = props;
  const onChange = (metrics: any) => {
    setMetrics((metrics || []).map(({ value }: EventType) => value));
  };
  return (
    <>
      <Query query={query}>
        {({ fetching, data, error }: any): any => {
          if (fetching) {
            return 'Loading...';
          } if (error) {
            return 'Oh no!';
          } if (!data) {
            return 'No data';
          }

          const metrics = data.getMetrics.map((metric: any) => ({
            value: metric,
            label: metric,
          }));

          return (
            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              onChange={onChange}
              options={metrics}
            />
          );
        }}
      </Query>
    </>
  );
};
