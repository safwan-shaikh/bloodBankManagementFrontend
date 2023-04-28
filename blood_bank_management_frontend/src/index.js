import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createStore } from 'redux';
import allReducers from './reducers';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, HashRouter } from 'react-router-dom';
import {createRoot} from 'react-dom/client';

const store = createStore(allReducers);
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <HashRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </HashRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// {/* <React.StrictMode>
// <App />
// </React.StrictMode>, */}
reportWebVitals();
