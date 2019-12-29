import React, { useState, useEffect } from 'react';
import Register from '../register/register.jsx';
import Login from '../login/login.jsx';
import './splash.scss';

function Splash(props){
    const [formState, setFormState] = useState('none');

    return (
        <div className="splash">
            <div className="logo">
                <h1>Fireworker</h1>
                <p>Protecting your data.</p>
            </div>
            <div className="cta">
            <span className="register-button" onClick={()=>setFormState('register')} >Try for Free</span>
    
            {formState === "register" ? (
                <Register 
                    setFormState={setFormState} 
                    setUser={props.setUser}
                />
                ):("")}
            {formState === "login"? (<Login 
                                        setFormState={setFormState} 
                                        setUser={props.setUser}
                                        />): ""}
            
            </div>
        </div>
    )
}

export default Splash;
