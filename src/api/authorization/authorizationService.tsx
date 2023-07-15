import axios from 'axios';
import {SERVER_API,getDefaultHeaders} from "../serverApi";

export const authenticateUser = (username:string,password:string): Promise<any> => {

    let data = {
        'username': username,
        'password': password
    }
    return axios.post(SERVER_API+'/authenticate',data)
        .then(res => {
            console.log("Authenticate response: " + res);
            return res.data;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

export const findUserRoleByToken = (token: string | null): Promise<any> => {

    const headers=getDefaultHeaders(token);
    return axios.post(SERVER_API+'/user/find/role/'+token, {},{headers})
        .then(res => {
            console.log("User username response: " + res);
            return res.data;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

export const findUsernameByToken = (token: string | null): Promise<any> => {

    const headers=getDefaultHeaders(token);
    return axios.post(SERVER_API+'/user/find/username/'+token, {},{headers})
        .then(res => {
            console.log("User role response: " + res);
            return res.data;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

export const registerUser = (username:string,password:string,firstName:string,lastName:string,email:string,phoneNumber:string,nationality:string,vehiclesOwned:string,accountType:string): Promise<any> => {

    let data = {
        "username": username,
        "password": password,
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "phoneNumber": phoneNumber,
        "nationality": nationality,
        "vehiclesOwned": vehiclesOwned,
        "accountType": accountType
    }
    return axios.post(SERVER_API+'/register',data)
        .then(res => {
            console.log("Registration response: " + res);
            return res.data;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}