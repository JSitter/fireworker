import React from 'react';
import './login.scss';

function Login(props){
  return (
    <div className="form-wrapper"> 
    <div className="close-x" onClick={()=>props.setFormState('none')}><i class="fas fa-times"></i></div>
      
      <form action="">
              <label htmlFor="email" className="required-field">Email</label>
              <input type="text" name="email" id="email"></input>

              <label htmlFor="password1" className="required-field">Password</label>
              <input type="text" name="password1" id="password1"></input>

              <label htmlFor="password2" className="required-field">Re Enter Password</label>
              <input type="text" name="password2" id="password2"></input>

              <section className="check-section">
                  <input type="checkbox" id="chk1-label"></input>
                  <label for="consent">I agree to allow cookies.</label>
              </section>
              <input className="submit" type='submit' />
      </form>
      <p><span className="spalink" onClick={()=>props.setFormState("register")}> Create New Account...</span></p>
    </div>
  )
}

export default Login;
