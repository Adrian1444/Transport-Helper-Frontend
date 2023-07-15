import React, {useEffect, useState} from "react";
import {findUsernameByToken, findUserRoleByToken} from "../api/authorization/authorizationService";
import {useNavigate} from "react-router-dom";
import {UserData} from "../mainPages/ProfilePage";
import {findUserData} from "../api/order/orderService";

function HomePageHeaderDriver(){

    const [role,setRole]=useState('');

    useEffect(() => {
        findUserRoleByToken(localStorage.getItem('token')).then(role => {
            setRole(role);
        })
    })

    /*
    <div className="dropdown">
                            <a
                                className="dropdown-toggle d-flex align-items-center hidden-arrow"
                                id="navbarDropdownMenuAvatar"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <img
                                    src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                                    className="rounded-circle"
                                    height="25"
                                    alt="Black and White Portrait of a Man"
                                    loading="lazy"
                                />
                            </a>
                            <ul
                                className="dropdown-menu dropdown-menu-end"
                                aria-labelledby="navbarDropdownMenuAvatar"
                            >
                                <li>
                                    <a className="dropdown-item" href="#">My profile</a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#">Settings</a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#">Logout</a>
                                </li>
                            </ul>
                        </div>
     */
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
                                <a className="nav-link" href="/home/driver">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/orders/driver">My orders</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/view/orders">Search orders</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/search/driver">Search people</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/view/followed">Followed people</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/profile/driver">Profile</a>
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

export default HomePageHeaderDriver;