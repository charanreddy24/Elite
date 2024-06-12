import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { store, persistor } from '/src/redux/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import ThemeProvider from '/src/components/ThemeProvider.jsx';
import { SocketContextProvider } from './components/SocketContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <ThemeProvider>
        <SocketContextProvider>
          <App />
        </SocketContextProvider>
      </ThemeProvider>
    </Provider>
  </PersistGate>,
);
