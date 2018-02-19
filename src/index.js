import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import './index.css';
import App from './App';

ReactGA.initialize('UA-22828082-3');
ReactDOM.render(<App />, document.getElementById('root'));
