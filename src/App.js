import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css';
import Main from './containers/Main/Main';
import Logo from './images/logo.png';

function App() {
  return (
    <Router>
    <div className="App">
      <header>
        <img src={Logo} alt="Logo" className="logo"/>
      </header>
      <Main/>
    </div>
    </Router>
  );
}

export default App;
