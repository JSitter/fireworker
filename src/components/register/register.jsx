import React, { useState, useEffect } from 'react';
import './register.scss';

function Register(props){
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [consent, setConsent] = useState('');
    const [viewPass, setViewPass] = useState(false);
    const [viewOptional, setViewOptional] = useState('hide'); // Display: 
    const [formReadyForSubmit, setFormReadyForSubmit] = useState('inactive');
    const [searchTimestamp, setSearchTimestamp] = useState(0);
    const [uniqueUsername, setUniqueUsername] = useState(false); // True with valid response from server
    const [searchUserName, setSearchUserName] = useState('');
    const [ passDisplaySetting, setPassDisplaySetting] = useState('password');

    useEffect(function(){
        if(userName.length > 3) {
            // Password must be longer than 6 characters
            if(password1 > 6 && (password1 === password2)){
                // Passwords match
                // REGISTRATION VALID
                setFormReadyForSubmit('valid-registration')
            }else{
                // passwords must match
            }
        }
    }, [userName, password1, password2, uniqueUsername]);

    function verifyUniqueUserName(userName){
        if(userName.length > 0){
            if((new Date().getTime() - searchTimestamp) > 400 ){
                //check for Username
                console.log("check Username on server: ", userName);
            }
        }
    }

    function handleUserNameChange(event){
        setSearchTimestamp(new Date().getTime());
        setUserName(event.target.value);
    }

    function handleEmailChange(event){
        setEmail(event.target.value);
    }
    
    function handlePass1Change(event){
        setPassword1(event.target.value);
    }

    function handlePass2Change(event){
        setPassword2(event.target.value);
    
    }
    function handleFirstNameChange(event){
    setFirstName(event.target.value);
    }

    function handleLastNameChange(event){
        setLastName(event.target.value);
    }

    function handlePhoneChange(event){
        setPhone(event.target.value);
    }

    function handleConsentChange(event){
        console.log("Set consent", event.target.value)
        setConsent(event.target.value)
    }
    
    function handleViewPassword(){
        if(passDisplaySetting == "text"){
            setPassDisplaySetting("password");
        }else{
        setPassDisplaySetting("text");
        }
    };   

    function handleOptionalFields(){
        if(viewOptional === 'hide'){
            viewOptional = 'show';
        }else{
            viewOptional = 'hide';
        }
    }

    return (
        <div className="registration-form form-wrapper">
            <div className="close-x" onClick={()=>props.setFormState('none')}><i class="fas fa-times"></i></div>
            <form>
            <label htmlFor="userName" className="required-field">User Name</label>
                <input type="text" name="userName" id="userName"></input>

                <span className="password-hint" onClick={()=>handleViewPassword()} >
                    {passDisplaySetting === "text" ? 'Hide Password' : 'View Password'}
                </span>
                <label htmlFor="password1" className="required-field">Password</label>
                <input type={passDisplaySetting} name="password1" id="password1"></input>

                <label htmlFor="password2" className="required-field">Re Enter Password</label>
                <input type={passDisplaySetting} name="password2" id="password2"></input>

                <p><span className="spalink" onClick={handleOptionalFields}>{ viewOptional === "hide" ? "Add Profile Information": "Hide Profile Details"}</span></p>
                <label className={viewOptional} htmlFor="firstName">First Name</label>
                <input className={viewOptional} type="text" name="firstName" id="firstName"></input>

                <label className={viewOptional} htmlFor="lastName">Last Name</label>
                <input className={viewOptional} type="text" name="lastName" id="lastName"></input>

                <label className={viewOptional} htmlFor="email">Email</label>
                <input className={viewOptional} type="text" name="email" id="email"></input>

                <label className={viewOptional} htmlFor="phone">Phone</label>
                <input className={viewOptional} type="text" name="phone" id="phone"></input>

                <section className="check-section">
                    <input type="checkbox" id="chk1-label"></input>
                    <label for="consent">I agree to allow cookies.</label>
                    <aside>Cookies may be used by this site for authentication purposes. This site does not track you across sites or share any of your personal information.</aside>
                </section>
                
                <input className={"submit " + formReadyForSubmit} type='submit' />

                <p>Already have an account? <span className="spalink" onClick={()=>props.setFormState('login')} >Login here</span>.</p>
            </form>
        </div>
    );
}

export default Register;