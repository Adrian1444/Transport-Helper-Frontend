import React, {useEffect, useState} from "react";
import {findUsernameByToken, findUserRoleByToken} from "../api/authorization/authorizationService";
import {
    createFollowRelation, deleteRelationBetweenUsers, editUserData,
    findUserAvatar,
    findUserData, findUserDataWithoutKnownRole,
    getRelationBetweenUsers, uploadClientAvatar,
    uploadUserAvatar
} from "../api/order/orderService";
import {useParams} from "react-router";

export interface UserData{
    username: string
    firstName: string,
    lastName: string,
    email: string
    phoneNumber: string,
    nationality: string,
    vehiclesOwned: string,
    avatarBase64: string,
    avatarContentType: string
}

const ProfilePage : React.FC = () =>{
    const [user,setUser]=useState<UserData | null>(null);
    const { username } = useParams<{ username?: string | undefined}>();
    const [currentUsername, setCurrentUsername] = useState<string>("");
    const [isOwnProfile,setIsOwnProfile]=useState(false);
    const [doesFollow,setDoesFollow]=useState(false);
    const [accessingProfileUsername,setAccessingProfileUsername]=useState<string>('');
    const [userRole,setUserRole]=useState('');

    useEffect(() => {
        if(username){
            setCurrentUsername(username);
            findUserDataWithoutKnownRole(username).then(user => {
                setUser(user);
                findUsernameByToken(localStorage.getItem('token')).then(username => {
                    if(user.username===username) {
                        setIsOwnProfile(true);
                        findUserRoleByToken(localStorage.getItem('token')).then(role=>{
                            setUserRole(role);
                        })
                    }
                    else{
                        setAccessingProfileUsername(username);
                        findUserRoleByToken(localStorage.getItem('token')).then(role=>{
                            setUserRole(role);
                            if(role==="driver") {
                                getRelationBetweenUsers(username, user.username).then(res => {
                                    console.log(res)
                                    if (res == 'following') {
                                        setDoesFollow(true);
                                    }
                                })
                            }
                        })
                    }
                })
            })
            /*findUserAvatar(username).then(async (data) => {
                if (data) {
                    let base64Image = await convertBlobToBase64(data);
                    if (base64Image) {
                        setImageSrc(base64Image);
                    }
                }
            })*/
        }else {
            setIsOwnProfile(true);
            findUsernameByToken(localStorage.getItem('token')).then(username => {
                findUserDataWithoutKnownRole(username).then(user => {
                    setUser(user);
                    setCurrentUsername(username);
                })
                /*findUserAvatar(username).then(async (data) => {
                    if (data) {
                        let base64Image = await convertBlobToBase64(data);
                        if (base64Image) {
                            setImageSrc(base64Image);
                        }
                    }
                })*/
            })

            findUserRoleByToken(localStorage.getItem('token')).then(role=>{
                setUserRole(role);
            })

        }
    }, []);


    const onUpload = ( )=>{
        if(userRole==="driver") {
            uploadUserAvatar(file, currentUsername).then(res => {
                /*findUserAvatar(currentUsername).then(async (data)=>{
                    if(data) {
                        let base64Image = await convertBlobToBase64(data);
                        if(base64Image) {
                            setImageSrc(base64Image);
                        }
                    }
                })*/
                findUserDataWithoutKnownRole(currentUsername).then(user => {
                    setUser(user);
                })
            });
        }else if(userRole==="client"){
            uploadClientAvatar(file, currentUsername).then(res => {
                /*findUserAvatar(currentUsername).then(async (data)=>{
                    if(data) {
                        let base64Image = await convertBlobToBase64(data);
                        if(base64Image) {
                            setImageSrc(base64Image);
                        }
                    }
                })*/
                findUserDataWithoutKnownRole(currentUsername).then(user => {
                    setUser(user);
                })
            });
        }
    }

    const [file, setFile] = useState<File | null>(null);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const [editMode,setEditMode]=useState(false)

    const editButtonClicked=()=>{
        if(editMode) {
            editUserData(currentUsername,firstName,lastName,email,phoneNumber,vehiclesOwned).then(res=>{
               findUserDataWithoutKnownRole(currentUsername).then(user => {
                  setUser(user);
                })
           })
            setEditMode(false)
        }
        else {
            setEditMode(true);
        }
    }

    const followButtonClicked=()=>{
        createFollowRelation(accessingProfileUsername,currentUsername);
        setDoesFollow(true);
    }

    const unfollowButtonClicked=()=>{
        deleteRelationBetweenUsers(accessingProfileUsername,currentUsername);
        setDoesFollow(false);
    }

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email,setEmail]=useState('');
    const [phoneNumber,setPhoneNumber]=useState('');
    const [vehiclesOwned, setVehiclesOwned] = useState('');

    const handleFirstNameChanged = (event: any) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChanged = (event: any) => {
        setLastName(event.target.value);
    };

    const handlePhoneNumberChanged = (event: any) => {
        setPhoneNumber(event.target.value);
    };


    const handleVehiclesOwnedChanged = (event: any) => {
        setVehiclesOwned(event.target.value);
    };

    const handleEmailChanged = (event: any) => {
        setEmail(event.target.value);
    };

    return (
        <div className="homePageClientDiv">
            <div className="row">
                <div className="col-lg-4 col-md-4">
                    <center>

                    {user?.avatarBase64 ? <img src={`data:${user?.avatarContentType};base64,${user?.avatarBase64}`} alt="UserAvatar" style={{width:"250px",height:"250px"}} /> : ''}
                    <br/>
                    <br/>
                        {isOwnProfile && (
                            <>
                            <p style={{"color":"#0a0a6c"}}> <b>Change your profile picture:</b></p>
                            <input type="file" className="form-control"  style={{width:"250px"}} onChange={onFileChange} />
                            <button type="button" className="btn btn-light" style={{width:"250px",borderColor:"lightgrey"}} onClick={onUpload}>Upload</button>
                            </>
                            )}
                        {!isOwnProfile && (
                            <>
                                {userRole==="driver" && <>
                                {!doesFollow  ?
                                    <button type="button" className="btn btn-primary" style={{width:"100px",borderColor:"lightgrey"}} onClick={followButtonClicked}>Follow</button>
                                    :
                                    <button type="button" className="btn btn-primary" style={{width:"100px",borderColor:"lightgrey"}} onClick={unfollowButtonClicked}>Unfollow</button>
                                }
                                </>}
                            </>
                        )}
                    </center>

                </div>
                <div className="col-lg-8 col-md-8">

                    {!editMode &&(
                    <>
                    <h1 className="orderConfirmation">{user?.lastName} {user?.firstName}</h1>
                        <ul className="list-group list-group-flush ">
                        <li className="list-group-item orderConfirmation"><b>Username:</b> {user?.username}</li>
                        <li className="list-group-item orderConfirmation"><b>Nationality:</b> {user?.nationality}</li>
                        <li className="list-group-item orderConfirmation"><b>Email:</b> {user?.email}</li>
                        <li className="list-group-item orderConfirmation"><b>Phone number:</b> {user?.phoneNumber}</li>
                            {userRole==="driver" && (
                            <li className="list-group-item orderConfirmation"><b>Vehicles owned:</b> {user?.vehiclesOwned}</li>
                            )}
                        </ul>
                    <br/>
                        {isOwnProfile && (
                            <button type="button" className="btn btn-primary" style={{width:"250px",borderColor:"lightgrey"}} onClick={editButtonClicked}>Edit profile</button>
                        )}
                    </>
                    )}
                    {editMode &&(
                        <>
                            <button type="button" className="btn btn-link"  onChange={editButtonClicked}>Back</button>
                            <br/>
                            <label className="clientFormDiv">
                                <h5>First name:</h5>
                            </label>
                            <br/>
                            <input type='text' className="clientFormDiv" onChange={handleFirstNameChanged} defaultValue={user?.firstName} style={{width:"450px",height:"30px"}} />
                            <br/>
                            <label className="clientFormDiv">
                                <h5>Last name:</h5>
                            </label>
                            <br/>
                            <input type='text' className="clientFormDiv" onChange={handleLastNameChanged} defaultValue={user?.lastName} style={{width:"450px",height:"30px"}} />
                            <br/>
                            <label className="clientFormDiv">
                                <h5>Phone number:</h5>
                            </label>
                            <br/>
                            <input type='text' className="clientFormDiv" onChange={handlePhoneNumberChanged} defaultValue={user?.phoneNumber} style={{width:"450px",height:"30px"}} />
                            <br/>
                            <label className="clientFormDiv">
                                <h5>Email:</h5>
                            </label>
                            <br/>
                            <input type='email' className="clientFormDiv" onChange={handleEmailChanged} defaultValue={user?.email} style={{width:"450px",height:"30px"}} />
                            <br/>
                            {userRole==="driver" && (<>
                            <label className="clientFormDiv">
                                <h5>Vehicles:</h5>
                            </label>
                            <br/>
                            <input type='text' className="clientFormDiv" onChange={handleVehiclesOwnedChanged} defaultValue={user?.vehiclesOwned} style={{width:"450px",height:"30px"}} />
                            <br/>
                            </>)}
                            <button type="button" className="btn btn-primary" style={{width:"450px",borderColor:"lightgrey"}} onClick={editButtonClicked}>Save</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

}
export default ProfilePage;