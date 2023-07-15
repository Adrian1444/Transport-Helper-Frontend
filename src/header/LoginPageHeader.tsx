import React, {useEffect, useState} from "react";
import {findUsernameByToken, findUserRoleByToken} from "../api/authorization/authorizationService";

export default function LoginPageHeader(){



    return(
        <>

            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container-fluid">


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
                                <a  style={{cursor:"default",color:"white"}}>Transport Helper</a>
                            </li>

                        </ul>
                    </div>


                </div>
            </nav>
        </>
    );
}

