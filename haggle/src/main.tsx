import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import './index.css';
import App from './App';

import { Provider } from 'react-redux';
import { store } from './store/index';

const theme = createTheme({
  palette: {
    primary: { main: '#1f6f4a' },
    background: { default: '#f6f7f5' },
  },
  shape: { borderRadius: 10 },
});

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
