import React from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

const useStyles = makeStyles({
  card: {
    width: '20%',
    marginRight: '1rem',
    marginBottom: '1rem',
  },
});

type PropTypes = {
  metric: string
};

export default ({ metric }: PropTypes) => {
  const classes = useStyles();
  const { values, unit } = useSelector((state: any) => state?.measurement[metric]);

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6">{metric}</Typography>
        <Typography variant="h3">{values} {unit}</Typography>
      </CardContent>
    </Card>
  );
};
