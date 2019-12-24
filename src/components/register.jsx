import React from 'react';
import './register.scss';

function Register(){
    return (
        <form className="registration">
            <aside>
                <span className="required-info">*</span> Are Required
            </aside>
            <label htmlFor="firstName">First Name</label>
            <input type="text" name="firstName" id="firstName"></input>

            <label htmlFor="lastName">Last Name</label>
            <input type="text" name="lastName" id="lastName"></input>

            <label htmlFor="email" className="required-field">Email</label>
            <input type="text" name="email" id="email"></input>

            <label htmlFor="phone">Phone</label>
            <input type="text" name="phone" id="phone"></input>

            <label htmlFor="password1" className="required-field">Password</label>
            <input type="text" name="password1" id="password1"></input>

            <label htmlFor="password2" className="required-field">Re Enter Password</label>
            <input type="text" name="password2" id="password2"></input>

            <section className="check-section">
                <input type="checkbox" id="chk1-label"></input>
                <label for="consent">I agree to allow cookies.</label>
            </section>
            
            <input type='submit' />
        </form>
    );
}

export default Register;