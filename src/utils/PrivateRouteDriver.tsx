import { Navigate, Route } from 'react-router-dom';
import {findUserRoleByToken} from "../api/authorization/authorizationService";
import React, {useEffect, useState} from "react";
import HomePageFooter from "../footer/HomePageFooter";
import HomePageHeaderDriver from "../header/HomePageHeaderDriver";

type PrivateRouteProps = {
    component: React.ComponentType;
    roles: string[];
};

export function PrivateRouteDriver({ component: Component, roles, ...rest }: PrivateRouteProps) {

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
                <div className="header"><HomePageHeaderDriver/></div>
                <Component/>
                <div className="push"/>
            </div>
            <footer className="footer"><HomePageFooter/></footer>
        </div>
    );
}
