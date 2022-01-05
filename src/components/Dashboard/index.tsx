import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import Metric from './Metric';
import Subscriber from './Subscriber';
import MetricSelection from './MetricSelection';
import { METRIC_RECEIVED } from '../../store/actions';
import { getMetrics } from '../../store/selector';
import Chart from './Chart';

const useStyles = makeStyles({
  wrapper: {
    height: '100vh',
    padding: '10px',
  },
  header: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column-reverse',
  },
  metrics: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '20px',
  },
  selection: {
    width: '100%',
  },
  chartWrapper: {
    width: '90%',
    margin: '0 auto',
  },
});

const Dashboard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const setMetrics = (metrics: string[]) => dispatch({ type: METRIC_RECEIVED, payload: metrics });
  const metrics = useSelector(getMetrics);
  return (
    <div className={classes.wrapper}>
      <Subscriber />
      <div className={classes.header}>
        <div className={classes.metrics}>
          {metrics.map((m: any) => (
            <Metric metric={m} key={m} />
          ))}
        </div>
        <div className={classes.selection}>
          <MetricSelection setMetrics={setMetrics} />
        </div>
      </div>
      <div className={classes.chartWrapper}>
        <Chart />
      </div>

    </div>
  );
};

export default Dashboard;
