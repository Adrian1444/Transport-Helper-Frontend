import React, {useEffect, useState} from "react";
import {findUsernameByToken} from "../api/authorization/authorizationService";
import {
    createFollowRelation, deleteRelationBetweenUsers,
    findUserAvatar,
    findUserData,
    getRelationBetweenUsers, uploadClientAvatar,
    uploadUserAvatar
} from "../api/order/orderService";
import {useParams} from "react-router";
import {UserData} from "./ProfilePage";



const ProfilePageClient : React.FC = () =>{
    const [user,setUser]=useState<UserData | null>(null);
    const { username } = useParams<{ username?: string | undefined}>();
    const [currentUsername, setCurrentUsername] = useState<string>("");
    const [isOwnProfile,setIsOwnProfile]=useState(false);

    useEffect(() => {
        if(username){
            setCurrentUsername(username);
            findUserData(username).then(user => {
                setUser(user);
                findUsernameByToken(localStorage.getItem('token')).then(username => {
                    if(user.username===username)
                        setIsOwnProfile(true);

                })
            })
        }else {
            setIsOwnProfile(true);
            findUsernameByToken(localStorage.getItem('token')).then(username => {
                findUserData(username).then(user => {
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
        }
    }, []);


    const onUpload = ( )=>{
        uploadClientAvatar(file,currentUsername).then(res=>{
            /*findUserAvatar(currentUsername).then(async (data)=>{
                if(data) {
                    let base64Image = await convertBlobToBase64(data);
                    if(base64Image) {
                        setImageSrc(base64Image);
                    }
                }
            })*/
            findUserData(currentUsername).then(user => {
                setUser(user);
            })
        });
    }

    const [file, setFile] = useState<File | null>(null);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const [editMode,setEditMode]=useState(false)

    const editButtonClicked=()=>{
        if(editMode)
            setEditMode(false)
        else
            setEditMode(true);
    }


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

                    </center>

                </div>
                <div className="col-lg-8 col-md-8">

                    {!editMode &&(
                        <>
                            <h1 className="orderConfirmation">{user?.lastName} {user?.firstName}</h1>
                            <ul className="list-group list-group-flush ">
                                <li className="list-group-item orderConfirmation"><b>Username:</b> </li>
                                <li className="list-group-item orderConfirmation"><b>Nationality:</b> </li>
                                <li className="list-group-item orderConfirmation"><b>Email:</b> </li>
                                <li className="list-group-item orderConfirmation"><b>Phone number:</b> </li>
                            </ul>
                            <br/>
                            {isOwnProfile && (
                                <button type="button" className="btn btn-primary" style={{width:"250px",borderColor:"lightgrey"}} onClick={editButtonClicked}>Edit profile</button>
                            )}
                        </>
                    )}
                    {editMode &&(
                        <>
                            <button type="button" className="btn btn-link"  onClick={editButtonClicked}>Back</button>
                            <br/>
                            <label className="clientFormDiv">
                                <h5>First name:</h5>
                            </label>
                            <br/>
                            <input type='text' className="clientFormDiv" defaultValue={user?.firstName} style={{width:"450px",height:"30px"}} />
                            <br/>
                            <label className="clientFormDiv">
                                <h5>Last name:</h5>
                            </label>
                            <br/>
                            <input type='text' className="clientFormDiv" defaultValue={user?.firstName} style={{width:"450px",height:"30px"}} />
                            <br/>
                            <label className="clientFormDiv">
                                <h5>Phone number:</h5>
                            </label>
                            <br/>
                            <input type='text' className="clientFormDiv" defaultValue={user?.firstName} style={{width:"450px",height:"30px"}} />
                            <br/>
                            <label className="clientFormDiv">
                                <h5>Email:</h5>
                            </label>
                            <br/>
                            <input type='email' className="clientFormDiv" defaultValue={user?.firstName} style={{width:"450px",height:"30px"}} />
                            <br/>

                            <button type="button" className="btn btn-primary" style={{width:"450px",borderColor:"lightgrey"}} onClick={editButtonClicked}>Save</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

}
export default ProfilePageClient;