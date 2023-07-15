import React, {useEffect, useRef, useState} from "react";
import {findUsernameByToken, findUserRoleByToken} from "../api/authorization/authorizationService";
import {
    createFollowRelation,
    createPost, deleteRelationBetweenUsers, findUserData,
    getFollowedUsersPosts,
    getRecommendations, getRelationBetweenUsers,
    searchUsers
} from "../api/order/orderService";
import {UserData} from "./ProfilePage";
import EmblaCarousel, {EmblaCarouselType} from 'embla-carousel';
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

interface PostData{
    id:number,
    userData: UserData,
    content: string,
    timestamp: string
}

const MainPageDriver  = () =>{

    const [username,setUsername]=useState('');
    const itemsPerPage=8;
    const [currentPagePosts, setCurrentPagePosts] = useState(1);
    const [paginatedPosts, setPaginatedPosts] = useState<PostData[]>([]);
    const [posts,setPosts]=useState<PostData[]>([]);
    const [totalPagesPosts,setTotalPagesPosts]=useState(1);

    const [showResults,setShowResults]=useState(false);
    const [updatePosts,setUpdatePosts]=useState(0);

    const [recommendations, setRecommendations] = useState<UserData[]>([]);

    useEffect(() => {
        const startIndex = (currentPagePosts - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
            findUsernameByToken(localStorage.getItem('token')).then(username => {
                getFollowedUsersPosts(username).then(data => {
                    console.log(data);
                    setPosts(data);
                    setTotalPagesPosts(Math.ceil(data.length / itemsPerPage))
                    setPaginatedPosts(data.slice(startIndex, endIndex));

                })
            })

    }, [updatePosts,currentPagePosts, itemsPerPage]);

    useEffect(() => {
        findUsernameByToken(localStorage.getItem('token')).then(username => {
           setUsername(username);
           getRecommendations(username).then(recommendations=>{
               setRecommendations(recommendations);
           })
        })

    }, []);

    const [currentPageUsers, setCurrentPageUsers] = useState(0);
    const [usersPerPage, setUsersPerPage] = useState(3);
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;

            // Adjust these values as needed
            if (width < 600) {
                setUsersPerPage(2);
            } else if (width < 900) {
                setUsersPerPage(3);
            } else {
                setUsersPerPage(5);
            }
        };

        window.addEventListener('resize', handleResize);

        // Call the handler right away so that the state gets updated with the initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handlePageChange = (page: number) => {
        if (page !== currentPagePosts) {
            setCurrentPagePosts(page);
        }
    };

    const updatePostsList=()=>{
        setUpdatePosts(updatePosts+1);
    }

    const [postText,setPostText]=useState('');

    const handlePostTextChanged = (event: any) => {
        setPostText(event.target.value);
    };

    const makePost = ()=>{
        createPost(username,postText);
        updatePostsList();
    }

    const totalPagesUsers = Math.ceil(recommendations.length / usersPerPage);

    const nextPage = () => {
        setCurrentPageUsers((oldPage) => Math.min(oldPage + 1, totalPagesUsers - 1));
    };

    const prevPage = () => {
        setCurrentPageUsers((oldPage) => Math.max(oldPage - 1, 0));
    };

    const startIndexUsers = currentPageUsers * usersPerPage;
    const selectedUsers = recommendations.slice(startIndexUsers, startIndexUsers + usersPerPage);

    const navigate = useNavigate();

    const viewUserProfileButtonClicked = (username: string) => {
        navigate("/profile/driver/"+username, {
        })
    }


    const [doesFollow,setDoesFollow]=useState<string[]>([]);
    const followButtonClicked=(clickedUsername:string)=>{
        createFollowRelation(username,clickedUsername);
        setDoesFollow((prevFollows) => [...prevFollows, clickedUsername]);
    }

    return (
        <div className="homePageClientDiv">

            <div className="d-flex">
                <img src="/icon/makePostIcon.png" style={{width: "1.9rem", height: "1.9rem"}} alt="Post Icon"/>
                <i><h4 className="addSpaceNearElement" style={{color: "#244a7c"}}>Make a post for your followers</h4></i>
            </div>
            <hr/>
            <div className="form-group shadow-textarea">
                <textarea className="form-control z-depth-1"  rows={3} placeholder="What is on your mind?" onChange={handlePostTextChanged}/>
                <br/>
                <button type="button" className="btn btn-primary" style={{width:"100px"}} onClick={makePost}>Make post</button>
            </div>
            <br/>

            <br/>
            <div className="d-flex">
                <img src="/icon/journalIcon.png" style={{width: "1.6rem", height: "1.6rem"}} alt="Post Icon"/>
                <i><h4 className="addSpaceNearElement" style={{color: "#244a7c"}}>Posts from followed people</h4></i>
            </div>
            <hr/>
            {posts.length ?
                <div>
                    <div >
                        <ul className="list-group list-group-flush ">

                            {paginatedPosts.map((post) => (

                                <li key={post.id} className="list-group-item orderConfirmation" >

                                    <div className="d-flex ">
                                        <img src={`data:${post.userData.avatarContentType};base64,${post.userData.avatarBase64}`} alt="UserAvatar" style={{width:"3rem",height:"3rem"}} />
                                        <div className="addSpaceNearElement">
                                            <h6>{post.userData.firstName} {post.userData.lastName} {post.timestamp}</h6>
                                            {post.content}
                                        </div>
                                    </div>
                                </li>

                            ))}

                        </ul>
                    </div>

                    <br/>
                    <div>

                        <ul className="pagination">
                            <li className={`page-item ${currentPagePosts === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPagePosts - 1)}>
                                    Previous
                                </button>
                            </li>

                            <li className={`page-item ${currentPagePosts === 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(1)}>
                                    1
                                </button>
                            </li>

                            {currentPagePosts > 3 && (
                                <li className="page-item">
                                    <span className="page-link">...</span>
                                </li>
                            )}

                            {currentPagePosts > 2 && (
                                <li className={`page-item ${currentPagePosts - 1 === 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(currentPagePosts - 1)}>
                                        {currentPagePosts - 1}
                                    </button>
                                </li>
                            )}

                            {currentPagePosts !== 1 && currentPagePosts !== totalPagesPosts && (
                                <li className="page-item active">
                                    <button className="page-link" onClick={() => handlePageChange(currentPagePosts)}>
                                        {currentPagePosts}
                                    </button>
                                </li>
                            )}

                            {currentPagePosts < totalPagesPosts - 1 && (
                                <li className={`page-item ${currentPagePosts + 1 === totalPagesPosts ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(currentPagePosts + 1)}>
                                        {currentPagePosts + 1}
                                    </button>
                                </li>
                            )}

                            {currentPagePosts < totalPagesPosts - 2 && (
                                <li className="page-item">
                                    <span className="page-link">...</span>
                                </li>
                            )}

                            {totalPagesPosts !== 1 && (
                                <li className={`page-item ${currentPagePosts === totalPagesPosts ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(totalPagesPosts)}>
                                        {totalPagesPosts}
                                    </button>
                                </li>
                            )}

                            <li className={`page-item ${currentPagePosts === totalPagesPosts ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPagePosts + 1)}>
                                    Next
                                </button>
                            </li>
                        </ul>

                    </div>

                </div>
                : <><h5><i><center>No posts found</center></i></h5></>}
            <br/>

            {recommendations.length ?
                <>
                    <div className="d-flex">
                        <img src="/icon/peopleIcon.png" style={{width: "1.8rem", height: "1.8rem"}} alt="Post Icon"/>
                        <i><h4 className="addSpaceNearElement" style={{color: "#244a7c"}}>People you may know</h4></i>
                    </div>
                    <hr/>
                <div style={{ position: 'relative', width: '100%', padding: '0 50px' }}>
                    <button
                        onClick={prevPage}
                        disabled={currentPageUsers === 0}
                        style={{ position: 'absolute', top: '50%', left: '0', transform: 'translateY(-50%)' }}
                        className="btn btn-link"
                    >
                        <img src="/leftArrow.png" style={{width: "2.5rem", height: "2.5rem"}} alt="Previous button"/>

                    </button>
                    <div className="d-flex justify-content-center">
                        {selectedUsers.map((user) => (
                            <div key={user.username} className="card" style={{margin:"0% 3%",borderColor:"white"}} >
                                <center>
                                    <img src={`data:${user.avatarContentType};base64,${user.avatarBase64}`} alt="UserAvatar" style={{width:"6rem",height:"6rem",cursor:"pointer"}} onClick={() => viewUserProfileButtonClicked(user.username)}/>
                                    <br/>
                                    <h5 style={{color: "#15509d",cursor:"pointer"}} onClick={() => viewUserProfileButtonClicked(user.username)}>{user.firstName} {user.lastName} </h5>
                                    {doesFollow.includes(user.username) ?
                                        <button type="button" className="btn btn-primary" style={{width:"7rem"}} disabled={true} >Following</button> :
                                        <button type="button" className="btn btn-primary" style={{width:"7rem"}} onClick={() => followButtonClicked(user.username)}>Follow</button>
                                    }

                                </center>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={nextPage}
                        disabled={currentPageUsers === totalPagesUsers - 1}
                        style={{ position: 'absolute', top: '50%', right: '0', transform: 'translateY(-50%)' }}
                        className="btn btn-link"
                    >
                        <img src="/rightArrow.png" style={{width: "2.5rem", height: "2.5rem"}} alt="Previous button"/>

                    </button>
                </div>
                </>
                :''
            }
        </div>
    );
}

export default MainPageDriver;
