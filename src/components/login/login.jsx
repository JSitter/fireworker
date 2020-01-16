import React, { useState, useEffect } from 'react';
import { userLogin } from '../../utils/lib.js';
import './login.scss';

function Login(props){
  const [ userName, setUserName ] = useState(null);
  const [ password, setPassword ] = useState(null);
  const [ consent, setConsent ] = useState(false); 
  const [ passDisplaySetting, setPassDisplaySetting] = useState('password');
  const [ formErrorMessage, setFormErrorMessage ] = useState('');

  useEffect(function(){
      window.onscroll = handleScroll;

      return (function(){
        window.onscroll = function(){};
      });
  }, []);

  function handleScroll(event){
      let element = document.getElementsByClassName("form-wrapper")[0]
      element.style.margin = "-"+(window.pageYOffset-30)+"px auto 0px auto";
  }

  function handleUserNameChange(event){
    setUserName(event.target.value);
  }

  function handlePassChange(event){
    setPassword(event.target.value);

  };

  function handleConsentChange(event){
    setConsent(event.target.checked);
  }

  function validForm(){
    if( password.length > 0){
      return true;
    }else{
      return false;
    }
  }

  function handleFormSubmit(event){
    event.preventDefault();
    
    if(validForm()){
      signIn();
    }else{
      setFormErrorMessage("Error: Invalid Form");
    }
  };

  function signIn(){
    let userData = {
      userName: userName,
      password: password,
      consent: consent,
    }
    userLogin(userData).then((response)=>{
      props.setUser(response);
    }).catch((err)=>{
      console.log("error", err);
    })
  }

  function handleViewPassword(){
    if(passDisplaySetting == "text"){
      setPassDisplaySetting("password");
    }else{
      setPassDisplaySetting("text");
    }
  };

  return (
    <div className="form-wrapper login-form-wrapper"> 
      <div className="close-x" onClick={()=>props.setFormState("none")}>
        <i class="fas fa-times"></i>
      </div>
      <div className="form-header">
        <h2>Log In</h2>
      </div>

      <form className="form-element" onSubmit={handleFormSubmit} >
        <label htmlFor="userName" className="required-field">User Name</label>
        <input type="text" name="userName" id="userName" onChange={handleUserNameChange}></input>

        <label htmlFor="password1" className="required-field">Password</label>
        <input type={passDisplaySetting} name="password1" id="password1" onChange={handlePassChange}></input>
                
        <span className="password-hint" onClick={handleViewPassword} >
            {passDisplaySetting === "text" ? "Hide Password" : "View Password"}
        </span>

        <section className="check-section">
          <input type="checkbox" id="chk1-label" onChange={handleConsentChange}></input>
          <label for="consent">I agree to allow cookies.</label>
          <aside>Cookies may be used by this site for authentication purposes. <br/>This site does not track you across sites or share any of your personal information.</aside>
        </section>
        <input className="submit" type="submit" value="Log In"/>
      </form>
      <p><span className="spalink" onClick={()=>props.setFormState("register")}> Create New Account...</span></p>
    </div>
  )
}

export default Login;
