import React from 'react';
import {
  Provider as UrqlProvider,
  createClient,
  defaultExchanges,
  subscriptionExchange,
} from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/Dashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(39,49,66)',
    },
    secondary: {
      main: 'rgb(197,208,222)',
    },
    background: {
      default: 'rgb(226,231,238)',
    },
  },
});

const subscriptionClient = new SubscriptionClient(`${process.env.REACT_APP_WEBSOCKET_URL}`,
  {
    reconnect: true,
    timeout: 20000,
  });

const client = createClient({
  url: `${process.env.REACT_APP_API_BASE_URL}`,
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation),
    }),
  ],
});

const App = () => (
  <UrqlProvider value={client}>
    <MuiThemeProvider theme={theme}>
      <Dashboard />
    </MuiThemeProvider>
  </UrqlProvider>
);

export default App;
