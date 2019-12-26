import React from 'react';
import './register.scss';



function Register(props){
    return (
        <div className="form-wrapper">
            <div className="close-x" onClick={()=>props.setFormState('none')}><i class="fas fa-times"></i></div>
            <form>
                <aside>
                    <span className="required-info">*</span> Required
                </aside>

                <label htmlFor="email" className="required-field">Email</label>
                <input type="text" name="email" id="email"></input>

                <label htmlFor="password1" className="required-field">Password</label>
                <input type="text" name="password1" id="password1"></input>

                <label htmlFor="password2" className="required-field">Re Enter Password</label>
                <input type="text" name="password2" id="password2"></input>

                <label htmlFor="firstName">First Name</label>
                <input type="text" name="firstName" id="firstName"></input>

                <label htmlFor="lastName">Last Name</label>
                <input type="text" name="lastName" id="lastName"></input>

                <label htmlFor="phone">Phone</label>
                <input type="text" name="phone" id="phone"></input>

                <section className="check-section">
                    <input type="checkbox" id="chk1-label"></input>
                    <label for="consent">I agree to allow cookies.</label>
                    <aside>Cookies may be used by this site to allow access for an extended period of time. This site does not sell or share any of your personal information.</aside>
                </section>
                
                <input className="submit" type='submit' />

                <p>Already have an account? <span className="spalink" onClick={()=>props.setFormState('login')} >Login here</span>.</p>
            </form>
        </div>
    );
}

export default Register;