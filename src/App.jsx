import React, { useState } from "react";
import ReactDOM from "react-dom";

import './App.scss';
import Splash from './components/splash/splash.jsx';
import Dashboard from './components/dashboard/dashboard.jsx';

function App() {
  const [ user, setUser ] = useState(null);
  return (
    <div>
      { user ? <Dashboard user={user}/> : <Splash setUser={setUser}/> }
    </div>
  )
}

export default App;
let appBody = document.getElementById("app-body");
appBody ? ReactDOM.render(<App/>, appBody) : false;