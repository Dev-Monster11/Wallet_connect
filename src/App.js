import React from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './screens/Home';
import Mobile from "./screens/Mobile"
import {isMobile} from 'react-device-detect';
import Fetch from "./screens/fetch"


function App() {
  return (
    <div className="App">
      {/* <Home /> */}
     {isMobile == true ? <Mobile />  : <Home />}
     {/* <Fetch /> */}
    {/* kk */}
    </div>
  );
}

export default App;