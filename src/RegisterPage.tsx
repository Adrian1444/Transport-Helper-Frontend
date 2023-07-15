import React, { useState } from 'react';
import './index.css';
import { useNavigate } from "react-router-dom";
import {authenticateUser, findUserRoleByToken, registerUser} from "./api/authorization/authorizationService";
import LoginPageHeader from "./header/LoginPageHeader";
import HomePageFooter from "./footer/HomePageFooter";

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email,setEmail]=useState('');
    const [phoneNumber,setPhoneNumber]=useState('');
    const [nationality, setNationality] = useState('');
    const [typeOfAccount, setTypeOfAccount] = useState('');
    const [vehiclesOwned, setVehiclesOwned] = useState('');

    const [errorMessage,setErrorMessage]=useState('');
    const [success,setSuccess]=useState(false);
    const navigate = useNavigate();

    const handleUsernameChanged = (event: any) => {
        setUsername(event.target.value);
    };

    const handlePasswordChanged = (event: any) => {
        setPassword(event.target.value);
    };

    const handleRepeatPasswordChanged = (event: any) => {
        setRepeatPassword(event.target.value);
    };

    const handleFirstNameChanged = (event: any) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChanged = (event: any) => {
        setLastName(event.target.value);
    };

    const handlePhoneNumberChanged = (event: any) => {
        setPhoneNumber(event.target.value);
    };

    const handleNationalityChanged = (event: any) => {
        setNationality(event.target.value);
    };

    const handleTypeOfAccountChanged = (event: any) => {
        setTypeOfAccount(event.target.value);
    };

    const handleVehiclesOwnedChanged = (event: any) => {
        setVehiclesOwned(event.target.value);
    };

    const handleEmailChanged = (event: any) => {
        setEmail(event.target.value);
    };

    function registerButtonClicked() {
        if(password!==repeatPassword){
            setErrorMessage("The passwords do not match!");
            return;
        }
       registerUser(username,password,firstName,lastName,email,phoneNumber,nationality,vehiclesOwned,typeOfAccount).then(res=>
        {
            console.log(res)
            if(res==null)
                setErrorMessage("Username already exists");
            else
                setSuccess(true);
        })
    }

    function backToLoginPage() {
        navigate("/", {
        })
    }

    return (
        <div className="pageWrapper">
            <div className="wrapper">
                <div className="header"><LoginPageHeader/></div>
                <section >
                    {success ?
                        <div>
                            <center>
                                <br/>
                                <h1 style={{color:"green"}}><i>Account created successfully!</i></h1>
                                <br/>
                                <button className="btn btn-primary" style={{textAlign:"left",backgroundColor:"green",borderColor:"green"}} onClick={backToLoginPage}>Back to login page</button>
                                <br/>
                            </center>
                        </div>
                        :
                    <div className="container py-5 ">
                        <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="col">
                                <div className="card card-registration my-4">
                                    <div className="row g-0">
                                        <div className="col-xl-6 d-none d-xl-block">
                                            <img
                                                src="/registerTruckImage.jpg"
                                                alt="Sample photo" className="img-fluid"
                                                style={{borderTopLeftRadius: ".25rem", borderBottomLeftRadius: ".25rem"}}/>
                                        </div>
                                        <div className="col-xl-6">
                                            <div className="card-body p-md-5 text-black">
                                                <button className="btn btn-link" style={{textAlign:"left"}} onClick={backToLoginPage}>Back to login page</button>
                                                <br/>
                                                <br/>
                                                <div className="row">
                                                    <div className="col-md-6 mb-4">
                                                        <div className="form-outline">
                                                            <input type="text" id="form3Example1m"
                                                                   className="form-control form-control-lg"
                                                                   onChange={handleFirstNameChanged}
                                                            />
                                                            <label className="form-label" htmlFor="form3Example1m">First
                                                                name</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 mb-4">
                                                        <div className="form-outline">
                                                            <input type="text" id="form3Example1n"
                                                                   className="form-control form-control-lg"
                                                                   onChange={handleLastNameChanged}/>
                                                            <label className="form-label" htmlFor="form3Example1n">Last
                                                                name</label>
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="form-outline mb-4">
                                                    <input type="email" id="form3Example8"
                                                           className="form-control form-control-lg"
                                                           onChange={handleEmailChanged}/>
                                                    <label className="form-label"
                                                           htmlFor="form3Example8">Email</label>
                                                </div>
                                                <div className="form-outline mb-4">
                                                    <input type="tel" id="form3Example8"
                                                           className="form-control form-control-lg"
                                                           onChange={handlePhoneNumberChanged}/>
                                                    <label className="form-label"
                                                           htmlFor="form3Example8">Phone number</label>
                                                </div>
                                                <div className="form-outline mb-4">
                                                    <input type="text" id="form3Example8"
                                                           className="form-control form-control-lg"
                                                           onChange={handleNationalityChanged}/>
                                                    <label className="form-label"
                                                           htmlFor="form3Example8">Nationality (name of the country you are a citizen of)</label>
                                                </div>
                                                <div className="form-outline mb-4">
                                                    <input type="text" id="form3Example8"
                                                           className="form-control form-control-lg"
                                                           onChange={handleUsernameChanged}/>
                                                    <label className="form-label"
                                                           htmlFor="form3Example8">Username (choose a username to log in the website)</label>
                                                </div>

                                                <div
                                                    className="d-md-flex justify-content-start align-items-center mb-4 py-2">

                                                    <h6 className="mb-0 me-4">Type of account: </h6>

                                                    <div className="form-check form-check-inline mb-0 me-4">
                                                        <input className="form-check-input" type="radio"
                                                               name="inlineRadioOptions" id="clientType"
                                                               value="clientType"
                                                               onChange={handleTypeOfAccountChanged}/>
                                                        <label className="form-check-label"
                                                               htmlFor="femaleGender">Client</label>
                                                    </div>

                                                    <div className="form-check form-check-inline mb-0 me-4">
                                                        <input className="form-check-input" type="radio"
                                                               name="inlineRadioOptions" id="driverType"
                                                               value="driverType"
                                                               onChange={handleTypeOfAccountChanged}/>
                                                        <label className="form-check-label"
                                                               htmlFor="maleGender">Driver</label>
                                                    </div>

                                                </div>

                                                {typeOfAccount==="driverType" && (
                                                    <div className="form-outline mb-4">
                                                        <input type="text" id="form3Example8"
                                                               className="form-control form-control-lg"
                                                               onChange={handleVehiclesOwnedChanged}/>
                                                        <label className="form-label"
                                                               htmlFor="form3Example8">Vehicles owned (ex. Scania 440 and Mercedes-Benz Sprinter 316) </label>
                                                    </div>
                                                )}

                                                <div className="form-outline mb-4">
                                                    <input type="password"
                                                           className="form-control form-control-lg"
                                                           onChange={handlePasswordChanged}/>
                                                    <label className="form-label" htmlFor="form3Example9">Password</label>
                                                </div>

                                                <div className="form-outline mb-4">
                                                    <input type="password"
                                                           className="form-control form-control-lg"
                                                           onChange={handleRepeatPasswordChanged}/>
                                                    <label className="form-label"
                                                           htmlFor="form3Example90">Confirm password</label>
                                                </div>

                                                <center>
                                                    {errorMessage.length!=0 && (<p style={{color:"red"}}>{errorMessage}</p>)}
                                                        <button type="button" className="btn btn-warning btn-lg ms-2" onClick={registerButtonClicked}>Submit
                                                        </button>


                                                </center>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    }
                </section>
                <div className="push"></div>
            </div>
            <br/>
            <footer className="footer"><HomePageFooter/></footer>

        </div>


    );
}

export default RegisterPage;