import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import './App.scss';
import Splash from './components/splash/splash.jsx';
import Dashboard from './components/dashboard/dashboard.jsx';
import { getCookie } from './utils/lib';

function App() {
  const [ user, setUser ] = useState(null);
  const [ serverCookie, setServerCookie ] = useState(null);

  useEffect(()=>{
    console.log("First Run")
    getCookie().then((cookie) => {
      setServerCookie(cookie.fToken);
    }).catch((err)=>{
      //User isn't Logged in
    })
  }, [setServerCookie]);

  return (
    <div>
      { (serverCookie || user ) ? <Dashboard user={user}/> : <Splash setUser={setUser}/> }
    </div>
  )
}

export default App;
let appBody = document.getElementById("app-body");
appBody ? ReactDOM.render(<App/>, appBody) : false;