import React, { Component } from 'react';

import { Terminal } from './components/Terminal';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Terminal />
      </div>
    );
  }
}

export default App;
