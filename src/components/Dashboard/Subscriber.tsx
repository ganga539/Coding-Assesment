import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSubscription } from 'urql';
import { MEASUREMENT_RECEIVED } from '../../store/actions';

const newMessages = `
subscription {
  newMeasurement {metric, at, value, unit}
}
`;

export default () => {
  const dispatch = useDispatch();
  const receiveMeasurement = useCallback(
    measurement => dispatch({
      type: MEASUREMENT_RECEIVED,
      payload: {
        measurement,
        metric: measurement.metric,
      },
    }),
    [dispatch],
  );
  const [subscriptionResponse] = useSubscription({ query: newMessages });
  const { data: subscriptionData } = subscriptionResponse;

  useEffect(
    () => {
      if (!subscriptionData) return;
      receiveMeasurement(subscriptionData.newMeasurement);
    },
    [subscriptionData, receiveMeasurement],
  );

  return null;
};
