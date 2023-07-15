import { Navigate, Route } from 'react-router-dom';
import {findUsernameByToken, findUserRoleByToken} from "../api/authorization/authorizationService";
import React, {useEffect, useState} from "react";
import HomePageHeaderClient from "../header/HomePageHeaderClient";
import HomePageFooter from "../footer/HomePageFooter";

type PrivateRouteProps = {
    component: React.ComponentType;
    roles: string[];
};


export function PrivateRouteClient({ component: Component, roles, ...rest }: PrivateRouteProps) {
    const [allowed, setAllowed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if(localStorage.getItem('token')===null) {
            setAllowed(false);
            setIsLoading(false);
        } else {
            findUserRoleByToken(localStorage.getItem('token')).then(role => {
                if (!roles.includes(role)) {
                    setAllowed(false);
                } else {
                    setAllowed(true);
                }
                setIsLoading(false);
            })
        }
    }, [roles]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!allowed) {
        return <Navigate to="/" />;
    }

    return(
        <div className="pageWrapper">
            <div className="wrapper">
                <div className="header"><HomePageHeaderClient/></div>
                <Component/>
                <div className="push"/>
            </div>
            <footer className="footer"><HomePageFooter/></footer>
        </div>
    );
}