import React from "react";
import ReactDOM from "react-dom";

import './App.scss';
import Splash from './components/splash/splash.jsx';

function App() {
  return (
    <div>
      <Splash />
    </div>
  )
}

export default App;
let appBody = document.getElementById("app-body");
appBody ? ReactDOM.render(<App/>, appBody) : false;