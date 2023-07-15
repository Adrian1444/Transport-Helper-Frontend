import React, {useEffect, useState} from "react";
import {findUsernameByToken, findUserRoleByToken} from "../api/authorization/authorizationService";
import {useNavigate} from "react-router-dom";
import {UserData} from "../mainPages/ProfilePage";
import {findUserData} from "../api/order/orderService";

export default function HomePageHeaderClient(){

    const [role,setRole]=useState('');

    useEffect(() => {
        findUserRoleByToken(localStorage.getItem('token')).then(role => {
            setRole(role);
        })
    })
    const navigate = useNavigate();

    const logOutButtonClicked = () => {
        localStorage.removeItem('token');
        navigate("/", {
        })
    }

    const [user,setUser]=useState<UserData | null>(null);

    useEffect(() => {
        findUsernameByToken(localStorage.getItem('token')).then(username => {
            findUserData(username).then(user => {
                setUser(user);
            })

        })

    }, []);

    return(
        <>

            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container-fluid">
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <img src="/icon/barsIcon.png"  style={{width: "1.6rem" ,height:"1.6rem"}} alt="logo"/>

                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <a className="navbar-brand mt-2 mt-lg-0" >
                            <img
                                src="/animatedTruck.png"
                                style={{width: "4.8rem" ,height:"2.8rem"}}
                                alt="TrHelper logo"
                            />
                        </a>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
                            <li className="nav-item">
                                <a className="nav-link" href="/home/client">Home</a>

                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/find/driver">Find driver</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/profile/client">Profile</a>
                            </li>
                        </ul>
                    </div>

                    <div className="d-flex align-items-center">
                        <a className="text-reset me-3" href="#">
                            <i className="fas fa-shopping-cart"/>
                        </a>


                        <a
                            className="d-flex align-items-center "

                        >{user?.avatarContentType && user?.avatarBase64 &&
                        <img
                            src={`data:${user?.avatarContentType};base64,${user?.avatarBase64}`}
                            className="rounded-circle"
                            width="35"
                            height="35"
                            alt="Black and White Portrait of a Man"
                            loading="lazy"
                        />
                        }
                        </a>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
                            <li className="nav-item">
                                <a className="nav-link" style={{cursor:"pointer"}} onClick={logOutButtonClicked}>Log out</a>

                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}

