import React, { useState } from 'react';
import './index.css';
import { useNavigate } from "react-router-dom";
import {authenticateUser, findUserRoleByToken} from "./api/authorization/authorizationService";
import LoginPageHeader from "./header/LoginPageHeader";
import HomePageFooter from "./footer/HomePageFooter";
import {UserData} from "./mainPages/ProfilePage";

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage,setErrorMessage]=useState(false);
    const navigate = useNavigate();

    const handleLogIn = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        localStorage.removeItem('token');
        console.log(`Submitted login form with username: ${username} and password: ${password}`);
        authenticateUser(username,password).then(response => {
            if(response===null)
                setErrorMessage(true);
            else{
                let token = response.jwt;
                localStorage.setItem('token', token);
                console.log(localStorage.getItem('token'));
                findUserRoleByToken(localStorage.getItem('token')).then(role => {
                    if(role==='client') {
                        navigate("/home/client", {
                            state: {
                                username: username
                            }
                        })
                    }else if(role==='driver'){
                        navigate("/home/driver", {
                            state: {
                                username: username
                            }
                        })
                    }
                })
            }
        });

    };

    const registerButtonClicked = () => {
        navigate("/register", {
        })
    }

    return (
        <div className="pageWrapper">
            <div className="wrapper">
                <div className="header"><LoginPageHeader/></div>
                <section className="h-100 gradient-form" >
                    <div className="container py-5 h-100">
                        <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="col-xl-10">
                                <div className="card rounded-3 text-black">
                                    <div className="row g-0">
                                        <div className="col-lg-6">
                                            <div className="card-body p-md-5 mx-md-4">
                                                <div className="text-center">
                                                    <img
                                                        src="/animatedTruck.png"
                                                        style={{width: "185px"}} alt="logo"/>
                                                    <h4 className="mt-1 mb-5 pb-1">Transport Helper</h4>
                                                    {errorMessage ? <div className="alert alert-danger" role="alert">
                                                        Invalid log in credentials
                                                        </div> : ''}
                                                </div>

                                                <form onSubmit={handleLogIn}>
                                                    <div className="form-outline mb-4">
                                                        <label className="form-label" htmlFor="form2Example22" >Username:</label>
                                                        <input type="username" id="form2Example11" className="form-control" value={username} onChange={(event) => setUsername(event.target.value)}/>
                                                    </div>

                                                    <div className="form-outline mb-4">
                                                        <label className="form-label" htmlFor="form2Example22" >Password:</label>
                                                        <input type="password" id="form2Example22" className="form-control" value={password} onChange={(event) => setPassword(event.target.value)} />
                                                    </div>

                                                    <div className="text-center pt-1 mb-5 pb-1">
                                                        <button
                                                            className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3"
                                                            type="submit">Log
                                                            in
                                                        </button>
                                                        <br/>
                                                    </div>

                                                    <div className="d-flex align-items-center justify-content-center pb-4">
                                                        <p className="mb-0 me-2">Don't have an account?</p>
                                                        <button type="button" className="btn btn-outline-danger" onClick={registerButtonClicked}>Create new
                                                        </button>
                                                    </div>

                                                </form>

                                            </div>
                                        </div>
                                        <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                                            <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                                                <h2 className="mb-4"><i>We are more than just a company</i></h2>
                                                <h4>Do you need help in transporting some items?</h4>
                                                <p className="small mb-0">
                                                    If so, this is the perfect place for you. It does not matter if you represent a company or are just a normal person.
                                                    We have a big community of drivers ready to help you or your company.
                                                    You have just to sign up and than you can easily place orders in order to find a driver to transport your goods.
                                                    We can find drivers that can transport any type of items: small packages, cars, furniture and many more!
                                                </p>
                                                <br/>
                                                <h4>Do you have a transporting vehicle and want to find clients?</h4>
                                                <p className="small mb-0">
                                                    You can sign up for free and find clients who need your help.
                                                    No matter what is your location and from which country are you from, you can find easily clients anywhere in Europe.
                                                    Also we have a big community of drivers and it is easy to meet new people or to be informed fast about different traffic events.
                                                    And not just that! We provide you with different tools that help you organize your orders.
                                                </p>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </section>
                <div className="push"></div>
            </div>
            <br/>
            <footer className="footer"><HomePageFooter/></footer>

        </div>


    );
}

export default LoginPage;