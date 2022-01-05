import { createStore, combineReducers } from 'redux';
import moment from 'moment';
import {
  METRIC_RECEIVED, MEASUREMENT_RECEIVED, MULTIPLE_MEASUREMENTS_RECEIVED, ActionType,
} from './actions';

const getMeasureMents = (state: any, metric: any) => {
  const measuredValues: any = { ...state };
  measuredValues[metric.metric] = {
    values: metric.measurement.value,
    unit: metric.measurement.unit,
  };
  if (measuredValues.series[metric.metric]) {
    measuredValues.series[metric.metric].values[
      measuredValues.series[metric.metric].values.length - 1] = metric.measurement.value;
    measuredValues.series[metric.metric].labels[
      measuredValues.series[metric.metric].labels.length - 1] = moment(metric.measurement.at).format('LT');
  }
  return measuredValues;
};

const getSeriesData = (data: any) => {
  const seriesData: any = {};
  data?.forEach((element: any) => {
    seriesData[element.metric] = {
      labels: element.measurements.map((val: any) => moment(val.at).format('LT')),
      values: element.measurements.map((val: any) => val.value),
    };
  });
  return seriesData;
};

const rootReducer = (state = { metrics: [] }, action: ActionType) => {
  switch (action.type) {
    case METRIC_RECEIVED:
      return { ...state, metrics: action.payload };
      break;
    default:
      return { ...state };
  }
};

const measureMentReducer = (state = {},
  action: ActionType) => {
  switch (action.type) {
    case MEASUREMENT_RECEIVED:
      return { ...state, ...getMeasureMents(state, action.payload) };
      break;
    case MULTIPLE_MEASUREMENTS_RECEIVED:
      return { ...state, series: { ...getSeriesData(action.payload) } };
    default:
      return { ...state };
  }
};
const reducer = combineReducers({ itemState: rootReducer, measurement: measureMentReducer });

const store = createStore(reducer);

export default store;
