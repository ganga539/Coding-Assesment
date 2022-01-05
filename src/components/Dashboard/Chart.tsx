import React, { useEffect, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useQuery } from 'urql';
import { useDispatch, useSelector } from 'react-redux';
import { getMetrics } from '../../store/selector';
import { MULTIPLE_MEASUREMENTS_RECEIVED } from '../../store/actions';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
    },
  },
};

const query = `
query($input: [MeasurementQuery]) {
  getMultipleMeasurements(input: $input) {
    metric
    measurements {
      at
      value
      metric
      unit
    }
  }
}
`;

const colors = [
  '#581845',
  '#C70039',
  '#FF5733',
  '#FFC300',
  '#900C3F',
  '#DAF7A6',
];
const currDate: any = new Date();
const calcThirtyMinutesAgo = () => currDate - 30 * 60 * 1000;
const thirtyMinutesAgo = calcThirtyMinutesAgo();

export default () => {
  const dispatch = useDispatch();
  const metrics = useSelector(getMetrics);
  const series = useSelector(getMetrics);
  const trafficSeries = useSelector((state: any) => {
    if (state.measurement?.series && Object.keys(state.measurement?.series).length > 0) {
      const chartLabels = state.measurement?.series[
        Object.keys(state.measurement.series)[0]]?.labels;
      return {
        labels: chartLabels.slice(chartLabels.length - 200, chartLabels.length + 1),
        datasets: Object.keys(state.measurement.series).map((item: any, i: number) => ({
          label: item,
          data: state.measurement.series[item].values.slice(
            state.measurement.series[item].values.length - 200,
            state.measurement.series[item].values.length + 1,
          ),
          borderColor: colors[i],
          backgroundColor: colors[i],

        })),

      };
    }
    return { labels: [], datasets: [] };
  });

  const receiveMultipleMeasurements = useCallback(
    getMultipleMeasurements => dispatch({
      type: MULTIPLE_MEASUREMENTS_RECEIVED,
      payload: getMultipleMeasurements,
    }),
    [dispatch],
  );

  const [queryResult] = useQuery(
    {
      query,
      variables: {
        input: metrics.map((metricName: any) => ({
          metricName,
          after: thirtyMinutesAgo,
        })),
      },
    },
  );
  useEffect(
    () => {
      const { data } = queryResult;
      if (!data) return;
      receiveMultipleMeasurements(data.getMultipleMeasurements);
    },
    [queryResult],
  );

  if (!series || series.length === 0) return null;

  return (
    <Line options={options} data={trafficSeries} />
  );
};
