import React, { useState } from 'react';
import './login.scss';

function Login(props){
  const [ email, setEmail ] = useState(null);
  const [ password, setPassword ] = useState(null);
  const [ passDisplaySetting, setPassDisplaySetting] = useState('password');
  function handleEmailChange(event){
    setEmail(event.target.value);
  }

  function handlePassChange(event){
    setPassword(event.target.value);
  }

  function handleViewPassword(){
    if(passDisplaySetting == "text"){
      setPassDisplaySetting("password");
    }else{
      setPassDisplaySetting("text");
    }
  };

  return (
    <div className="form-wrapper"> 
    <div className="close-x" onClick={()=>props.setFormState('none')}><i class="fas fa-times"></i></div>
      
      <form action="">
        <label htmlFor="email" className="required-field">Email</label>
        <input type="text" name="email" id="email" onChange={handleEmailChange} value={email} ></input>
        
        <label htmlFor="password" className="required-field">Password</label>
        <input type={passDisplaySetting} name="password" id="password" onChange={handlePassChange} value={password}></input>
        <span className="password-hint" onClick={()=>handleViewPassword()} >
          {passDisplaySetting === "text" ? 'Hide Password' : 'View Password'}
        </span>

        <section className="check-section">
            <label for="consent">
            <input type="checkbox" id="chk1-label"></input>
            I agree to allow cookies.</label>
        </section>
        <input className="submit" type='submit' />
      </form>
      <p><span className="spalink" onClick={()=>props.setFormState("register")}> Create New Account...</span></p>
    </div>
  )
}

export default Login;
