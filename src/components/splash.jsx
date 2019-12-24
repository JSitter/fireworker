import React from 'react';
import Register from './register.jsx';
import './splash.scss';

function Splash(){
    return (
        <div className="splash">
            <div className="logo">
                <h1>Fireworker</h1>
                <p>Protecting your data.</p>
            </div>
            <div>
            <a href="#" className="register-button">Register</a>
            <Register />
            </div>
          
        </div>
    )
}

export default Splash;