import React, { useState, useEffect } from 'react';
import CheckUsername from '../checkUsername/checkUsername.jsx';
import {checkUserAvailability} from '../../../utils/lib.js';

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
    const [viewOptional, setViewOptional] = useState('hide'); // Display: 
    const [formReadyForSubmit, setFormReadyForSubmit] = useState('inactive');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState(false);
    let [userNameTimeStamp, setSearchTimeStamp] = useState(0);
    const [uniqueUsername, setUniqueUsername] = useState(false); // True with valid response from server
    const [passwordMatch, setPasswordMatch] = useState(false)
    const [passwordTimeStamp, setPasswordTimeStamp] = useState(0);
    const [ passDisplaySetting, setPassDisplaySetting] = useState('password');
    const [ usernameStatus, setUsernameStatus] = useState('');
    let formElement;

    useEffect(function(){
        console.log("u: ", uniqueUsername);
        console.log("p: ", passwordMatch);
        console.log("l: ", userName.length)
        
        if(userName.length > 0) {
            // Password must be longer than 6 characters
            if(uniqueUsername && passwordMatch){
                // Passwords match
                // REGISTRATION VALID
                setFormReadyForSubmit('valid-registration');
                console.log("Ready for submission");
            }else{
                // passwords must match
                console.log("passwords don't match")
                setFormReadyForSubmit('inactive');
            }
        }

    }, [userName, uniqueUsername, passwordMatch, setFormReadyForSubmit ]);



    // Scroll Effects
    useEffect(function(){
        window.onscroll = handleScroll;
        formElement = document.getElementsByClassName("form-element")[0]
        return ()=>{
            // unbind scroll event
        }
    }, []);

    // userName Verification on interval
    useEffect(function(){
        const interval = setInterval(
            verifyUniqueUserName, 1000);
        return () => clearInterval(interval);
    }, [userName, userNameTimeStamp])

    // Check if passwords match every 400ms
    useEffect(function(){
        const interval = setInterval(
            verifyPasswordMatch, 200);
        return () => clearInterval(interval);
    }, [password1, password2, passwordTimeStamp])

    //Helper Functions

    function handleScroll(event){
        formElement.style.margin = "-"+(window.pageYOffset+20)+"px auto 0px auto";
    }

    function verifyUniqueUserName(){
        if(userName.length > 0){
            if(userNameTimeStamp > 0){
                if((new Date().getTime() - userNameTimeStamp) > 900 ){
                    setUsernameStatus("busy");
                    //check for Username
                    setSearchTimeStamp(0);

                    checkUserAvailability(userName).then((response)=>{
                        if(response.found){
                            setUsernameStatus('taken');
                            setUniqueUsername(false);
                        }else{
                            setUsernameStatus('available');
                            setUniqueUsername(true);
                        }
                    });
                }
            }
        }else{
            setUsernameStatus('');
            setUniqueUsername(false);
        }    
    }

    function verifyPasswordMatch(){
        if(passwordTimeStamp > 0){
            if(((new Date().getTime() - passwordTimeStamp) > 400)){
                if(password1.length != 0 && password2.length != 0){
                    console.log("Verify password");
                    setPasswordTimeStamp(0)

                    if(password1 === password2){
                        if(password1.length > 6){
                            
                            console.log("passwords match");
                            setPasswordMatch(true);
                            setPasswordErrorMessage('');
                            
                        }else {
                            console.log("Passwords too short");
                            setPasswordErrorMessage("Passwords must be 7 characters or longer.");
                            setPasswordMatch(false);
                        }
                    }else {
                        console.log("Passwords don't match");
                        setPasswordErrorMessage("Passwords don't match.");
                        setPasswordMatch(false);
                    }
                }else {
                    setPasswordMatch(false);
                    setPasswordErrorMessage('');
                }
            }
        }
    }

    function handleUserNameChange(event){
        setSearchTimeStamp(new Date().getTime());
        setUserName(event.target.value);
    }

    function handleEmailChange(event){
        setEmail(event.target.value);
    }
    
    function handlePass1Change(event){
        setPasswordTimeStamp(new Date().getTime());
        setPassword1(event.target.value);
    }

    function handlePass2Change(event){
        let time = new Date().getTime()
        setPasswordTimeStamp(time);
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
            setViewOptional('show');
        }else{
            setViewOptional('hide');
        }
    }

    function handleRegistrationSubmit(event){
        console.log('Registering user');
    }

    return (
        <div className="registration-form form-wrapper" action={handleRegistrationSubmit}>
            <div className="close-x" onClick={()=>props.setFormState('none')}><i class="fas fa-times"></i></div>
            <div className="form-header"><h2>Create New Account</h2></div>
            <form className="form-element">
                <label htmlFor="userName" className="required-field">User Name</label> <CheckUsername status={usernameStatus} />
                <input type="text" name="userName" id="userName" onChange={handleUserNameChange}></input>

                <label htmlFor="password1" className="required-field">Password</label>
                <input type={passDisplaySetting} name="password1" id="password1" onChange={handlePass1Change}></input>
                
                <span className="password-hint" onClick={()=>handleViewPassword()} >
                    {passDisplaySetting === "text" ? 'Hide Password' : 'View Password'}
                </span>

                <label htmlFor="password2" className="required-field">Re Enter Password</label>
                <input type={passDisplaySetting} name="password2" id="password2" onChange={handlePass2Change}></input>

                <p><span className="spalink" onClick={handleOptionalFields}>{ viewOptional === "hide" ? "+ Add Additional Profile Information": "- Hide Profile Details"}</span></p>
                <label className={viewOptional} htmlFor="firstName">First Name</label>
                <input className={viewOptional} type="text" name="firstName" id="firstName" onChange={handleFirstNameChange}></input>

                <label className={viewOptional} htmlFor="lastName">Last Name</label>
                <input className={viewOptional} type="text" name="lastName" id="lastName" onChange={handleLastNameChange}></input>

                <label className={viewOptional} htmlFor="email">Email</label>
                <input className={viewOptional} type="text" name="email" id="email" onChange={handleEmailChange}></input>

                <label className={viewOptional} htmlFor="phone">Phone</label>
                <input className={viewOptional} type="text" name="phone" id="phone" onChange={handlePhoneChange}></input>

                <section className="check-section">
                    <input type="checkbox" id="chk1-label" onChange={handleConsentChange}></input>
                    <label for="consent"><span>I agree to allow this site to use cookies.</span></label>
                    <aside>Cookies may be used by this site for authentication purposes. This site does not track you across other sites nor does it share any of your personal information.</aside>
                </section>
                
                <input className={"submit " + formReadyForSubmit} type='submit' value="Register New Account" />

                <p>Already have an account? <span className="spalink" onClick={()=>props.setFormState('login')} >Login here</span>.</p>
            </form>
        </div>
    );
}

export default Register;