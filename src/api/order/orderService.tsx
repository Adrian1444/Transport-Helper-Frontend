import axios from 'axios';
import {SERVER_API,getDefaultHeaders} from "../serverApi";

import imageCompression from 'browser-image-compression';
import {findUserRoleByToken} from "../authorization/authorizationService";

export const addOrder = (username: string, origin: string, destination: string, transportType: string, weight: unknown, numberOfItems: unknown, pickupDate: unknown, additionalInformation: unknown, latitudeOrigin: string,longitudeOrigin: string,latitudeDestination:string,longitudeDestination:string,cost:unknown): Promise<any>  => {
    let data = {
        "origin": origin,
        "destination": destination,
        "transportType": transportType,
        "weight": (typeof weight === 'string') ? parseFloat(weight) : null,
        "numberOfItems": (typeof numberOfItems === 'string') ? parseInt(numberOfItems) : null,
        "cost": (typeof cost === 'string') ? parseFloat(cost) : null,
        "pickupDate": pickupDate,
        "additionalInformation": additionalInformation,
        "placedByUsername": username,
        "latitudeOrigin": latitudeOrigin,
        "longitudeOrigin": longitudeOrigin,
        "latitudeDestination": latitudeDestination,
        "longitudeDestination": longitudeDestination
    }

    console.log(data);
    console.log("Sending order with the follwoing data: "+ data);
    const headers=getDefaultHeaders(localStorage.getItem('token'));

    return axios.post(SERVER_API+'/order/client/add', data,{headers}).then(res => {
        console.log("Sending order response: " + res);
        return res.data;
    }).catch(err => {
        console.log(err);
        return null;
    });
}

export const findAllOrdersPlacedByUser = (username: string): Promise<any> => {

    const headers=getDefaultHeaders(localStorage.getItem('token'));
    return axios.get(SERVER_API+'/order/client/find/placedBy/'+username, {headers})
        .then(res => {
            console.log("Find all orders response:" );
            console.log(res.data);
            return res.data;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

export const findAllOrdersAcceptedByUser = (username: string): Promise<any> => {

    const headers=getDefaultHeaders(localStorage.getItem('token'));
    return axios.get(SERVER_API+'/order/driver/find/acceptedBy/'+username, {headers})
        .then(res => {
            console.log("Find all orders response:" );
            console.log(res.data);
            return res.data;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

export const updateOrderStatus= (status:string,id:number): Promise<any> =>{
    const headers=getDefaultHeaders(localStorage.getItem('token'));
    return axios.put(SERVER_API+'/order/update/status/'+status+'/'+id,{}, {headers})
        .then(res => {
            console.log("Updated order status:" );
            return res;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

export const filterOrders= (origin:string,destination:string,transportType:string[],minWeight:unknown,maxWeight:unknown,minNumberOfItems:unknown,maxNumberOfItems:unknown,pickupDate:unknown,minCost:unknown,maxCost:unknown): Promise<any> =>{
    const headers=getDefaultHeaders(localStorage.getItem('token'));
    let data={
        "origin": origin,
        "destination": destination,
        "transportTypeList": transportType,
        "minWeight": (typeof minWeight === 'string') ? parseFloat(minWeight) : null,
        "maxWeight": (typeof maxWeight === 'string') ? parseFloat(maxWeight) : null,
        "minNumberOfItems": (typeof minNumberOfItems === 'string') ? parseInt(minNumberOfItems) : null,
        "maxNumberOfItems": (typeof maxNumberOfItems === 'string') ? parseInt(maxNumberOfItems) : null,
        "pickupDate": (typeof pickupDate === 'string') ? pickupDate : null,
        "minCost": (typeof minCost === 'string') ? parseFloat(minCost) : null,
        "maxCost": (typeof maxCost === 'string') ? parseFloat(maxCost) : null
    }

    return axios.post(SERVER_API+'/order/driver/find/filter',data, {headers})
        .then(res => {
            console.log("Filtering orders:" );
            return res.data;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

export const confirmOrder= (id:number,acceptedByUsername:string,startingDate:string,
                            startingTime:string,durationToPickupLocation:string,
                            durationToDestination:string): Promise<any> =>{
    const headers=getDefaultHeaders(localStorage.getItem('token'));
    const data = {
        id: id,
        acceptedByUsername: acceptedByUsername,
        startingDate: startingDate,
        startingTime: startingTime,
        durationToPickupLocation: durationToPickupLocation,
        durationToDestination: durationToDestination
    };
    return axios.post(SERVER_API+'/order/driver/update/confirm',data, {headers})
        .then(res => {
            console.log("Confirming order" );
            return res.data;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

export const findAllOrdersGraph = (username: string): Promise<any> => {

    const headers=getDefaultHeaders(localStorage.getItem('token'));
    return axios.get(SERVER_API+'/order/driver/find/orders/graph/'+username, {headers})
        .then(res => {
            console.log("Find orders graph response:" );
            console.log(res.data);
            return res.data;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

export const findAllOrdersLocations = (username: string): Promise<any> => {

    const headers=getDefaultHeaders(localStorage.getItem('token'));
    return axios.get(SERVER_API+'/order/driver/find/orders/locations/'+username, {headers})
        .then(res => {
            console.log("Find orders locations response:" );
            console.log(res.data);
            return res.data;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

export const findOrdersGraphShortestPath= (username:string,source:string,destination:string,intermediateNodes:string[]): Promise<any> =>{
    const headers=getDefaultHeaders(localStorage.getItem('token'));
    let data={
        "acceptedBy": username,
        "source": source,
        "destination": destination,
        "intermediateNodes": intermediateNodes
    }

    return axios.post(SERVER_API+'/order/driver/find/orders/graph/shortestpath',data, {headers})
        .then(res => {
            console.log("Shortest path:" );
            return res.data;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

export const findRecommendedRoute  = (username: string,startingNode:string): Promise<any> => {

    const headers=getDefaultHeaders(localStorage.getItem('token'));
    return axios.get(SERVER_API+'/order/driver/find/orders/graph/allnodes/shortestpath/constraints/'+username+'/'+startingNode, {headers})
        .then(res => {
            console.log("Find recommended route response:" );
            console.log(res.data);
            return res.data;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

export const findShortestPathThroughAllLocations  = (username: string,startingNode:string): Promise<any> => {

    const headers=getDefaultHeaders(localStorage.getItem('token'));
    return axios.get(SERVER_API+'/order/driver/find/orders/graph/allnodes/shortestpath/'+username+'/'+startingNode, {headers})
        .then(res => {
            console.log("Find recommended route response:" );
            console.log(res.data);
            return res.data;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

export const findUserData= (username: string): Promise<any>  => {

    const headers=getDefaultHeaders(localStorage.getItem('token'));
    return findUserRoleByToken(localStorage.getItem('token')).then(role=>{
        return axios.get(SERVER_API+'/user/'+role+'/find/entity/'+username, {headers})
            .then(res => {
                console.log("Find user data" );
                console.log(res.data);
                return res.data;
            })
            .catch(err => {
                console.log(err);
                return null;
            });
    })

}

export const findUserDataWithoutKnownRole= (username: string): Promise<any>  => {

    const headers=getDefaultHeaders(localStorage.getItem('token'));
        return axios.get(SERVER_API+'/find/entity/'+username, {headers})
            .then(res => {
                console.log("Find user data" );
                console.log(res.data);
                return res.data;
            })
            .catch(err => {
                console.log(err);
                return null;
            });

}

export const findUserAvatar=(username:string): Promise<any> => {
    const headers=getDefaultHeaders(localStorage.getItem('token'));
    return axios.get(SERVER_API+'/user/driver/find/avatar/'+username, {headers, responseType: 'blob'})
        .then(res => {
            console.log("Find user avatar:" );
            return res.data;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}


export const uploadUserAvatar = async (file: File|null,username:string) => {
    if (!file) return;

    const options = {
        maxSizeMB: 1,          // (default: Number.POSITIVE_INFINITY)
        maxWidthOrHeight: 300,  // compressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight (default: undefined)
        useWebWorker: true,      // optional, use multi-thread web worker, fallback to run in main-thread (default: true)
        maxIteration: 10         // optional, max number of iteration to compress the image (default: 10)
    }

    const compressedFile = await imageCompression(file, options);

    const formData = new FormData();
    //formData.append('photo', file);
    formData.append('photo', compressedFile);

    const headers={
        'Authorization': 'Bearer '+localStorage.getItem('token')
    }


    try {

        await axios.post(SERVER_API+'/user/driver/upload/avatar/'+username, formData, {headers});
        console.log('Photo uploaded successfully');
    } catch (error) {
        console.error('Error uploading photo', error);
    }


};

export const uploadClientAvatar = async (file: File|null,username:string) => {
    if (!file) return;

    const options = {
        maxSizeMB: 1,          // (default: Number.POSITIVE_INFINITY)
        maxWidthOrHeight: 300,  // compressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight (default: undefined)
        useWebWorker: true,      // optional, use multi-thread web worker, fallback to run in main-thread (default: true)
        maxIteration: 10         // optional, max number of iteration to compress the image (default: 10)
    }

    const compressedFile = await imageCompression(file, options);

    const formData = new FormData();
    //formData.append('photo', file);
    formData.append('photo', compressedFile);

    const headers={
        'Authorization': 'Bearer '+localStorage.getItem('token')
    }


    try {

        await axios.post(SERVER_API+'/user/client/upload/avatar/'+username, formData, {headers});
        console.log('Photo uploaded successfully');
    } catch (error) {
        console.error('Error uploading photo', error);
    }


};

export const searchUsers = (username: string, searchString: string): Promise<any> => {

    const headers=getDefaultHeaders(localStorage.getItem('token'));
    return axios.get(SERVER_API+'/user/driver/find/users/'+username+'/'+searchString, {headers})
        .then(res => {
            console.log("Search users response" );
            console.log(res.data);
            return res.data;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

export const createFollowRelation= (username1:string,username2:string): Promise<any> =>{
    const headers=getDefaultHeaders(localStorage.getItem('token'));

    return axios.post(SERVER_API+'/user/driver/create/follow/relation/'+username1+'/'+username2, {},{headers})
        .then(res => {
            console.log("Creating follow relation" );
            return res.data;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

export const getRelationBetweenUsers= (username1:string,username2:string): Promise<any> =>{
    const headers=getDefaultHeaders(localStorage.getItem('token'));

    return axios.get(SERVER_API+'/user/driver/get/follow/relation/'+username1+'/'+username2, {headers})
        .then(res => {
            console.log("Get relation between users" );
            console.log(res.data);
            return res.data;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

export const deleteRelationBetweenUsers= (username1:string,username2:string): Promise<any> =>{
    const headers=getDefaultHeaders(localStorage.getItem('token'));
    return axios.delete(SERVER_API+'/user/driver/delete/follow/relation/'+username1+'/'+username2, {headers})
        .then(res => {
            console.log("Delete relation between users" );
            return res;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

export const getFollowedUsersPosts= (username:string): Promise<any> =>{
    const headers=getDefaultHeaders(localStorage.getItem('token'));

    return axios.get(SERVER_API+'/user/driver/get/posts/'+username, {headers})
        .then(res => {
            console.log("Get followed users posts" );
            return res.data;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

export const createPost= (username:string,content:string): Promise<any> =>{
    const headers=getDefaultHeaders(localStorage.getItem('token'));
    let data={
        "username": username,
        "content": content
    }

    return axios.post(SERVER_API+'/user/driver/create/post',data, {headers})
        .then(res => {
            console.log("Creating post by user "+username);
            return res.data;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

export const getRecommendations= (username:string): Promise<any> =>{
    const headers=getDefaultHeaders(localStorage.getItem('token'));

    return axios.get(SERVER_API+'/user/driver/get/recommendations/'+username, {headers})
        .then(res => {
            console.log("Get user recommendations" );
            return res.data;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

export const getFollowedPersons=(username:string): Promise<any>=>{
    const headers=getDefaultHeaders(localStorage.getItem('token'));

    return axios.get(SERVER_API+'/user/driver/get/followed/people/'+username, {headers})
        .then(res => {
            console.log("Get user recommendations" );
            return res.data;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

export const editUserData= (username: string | undefined, firstName: string, lastName: string, email: string, phoneNumber: string, vehiclesOwned: string): Promise<any> =>{
    let data = {
        "username": username,
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "phoneNumber": phoneNumber,
        "vehiclesOwned": vehiclesOwned,
    }

    const headers=getDefaultHeaders(localStorage.getItem('token'));
    return findUserRoleByToken(localStorage.getItem('token')).then(role=> {
        return axios.put(SERVER_API + '/user/' + role + '/edit/data', data, {headers})
            .then(res => {
                console.log("Updated user data");
                return res;
            })
            .catch(err => {
                console.log(err);
                return null;
            });
    });
}