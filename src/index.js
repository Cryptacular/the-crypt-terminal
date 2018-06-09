import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import './index.css';
import App from './App';
import { wakeApi } from './components/Api';

ReactGA.initialize('UA-22828082-3');
ReactGA.pageview(window.location.pathname + window.location.search);
ReactDOM.render(<App />, document.getElementById('root'));
wakeApi();
