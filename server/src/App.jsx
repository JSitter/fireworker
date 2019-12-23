import React, { useState } from "react";
import ReactDOM from "react-dom";

import './css/style.scss';

function App() {
  return (
    <div>Hello</div>
  )
}

export default App;
let appBody = document.getElementById("app-body");
appBody ? ReactDOM.render(<App/>, appBody) : false;