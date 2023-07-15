import {
    Autocomplete, LoadScript
} from '@react-google-maps/api'
import React, {useEffect, useState} from "react";
import {UserData} from "./ProfilePage";
import {filterOrders, getFollowedPersons, searchUsers} from "../api/order/orderService";
import AcceptOrder from "./AcceptOrder";
import {useNavigate} from "react-router-dom";
import {findUsernameByToken} from "../api/authorization/authorizationService";

function ViewFollowedPeoplePage(){
    const navigate = useNavigate();


    const itemsPerPage=10;
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedData, setPaginatedData] = useState<UserData[]>([]);
    const [data,setData]=useState<UserData[]>([]);
    const [totalPages,setTotalPages]=useState(1);

    const [updateData,setUpdateData]=useState(0);

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

            findUsernameByToken(localStorage.getItem('token')).then(username => {
                getFollowedPersons(username).then(data => {
                    setData(data);
                    setTotalPages(Math.ceil(data.length / itemsPerPage))
                    setPaginatedData(data.slice(startIndex, endIndex));
                })
            })

    }, [updateData,currentPage, itemsPerPage]);

    const handlePageChange = (page: number) => {
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    };




    const viewUserProfileButtonClicked = (user: UserData) => {
        navigate("/profile/driver/"+user.username, {
        })
    }

    return(
        <div className="homePageClientDiv">

            {data.length  ?
                <div>
                    <div >
                        <ul className="list-group list-group-flush ">

                            {paginatedData.map((user) => (

                                <li key={user.username} className="list-group-item orderConfirmation searchUser" onClick={() => viewUserProfileButtonClicked(user)}>

                                    <div className="d-flex align-items-center">
                                        <img src={`data:${user?.avatarContentType};base64,${user?.avatarBase64}`} alt="UserAvatar" style={{width:"6rem",height:"6rem"}} />
                                        <div className="addSpaceNearElement">
                                            <h5>{user.firstName} {user.lastName}</h5>
                                        </div>
                                    </div>
                                </li>

                            ))}

                        </ul>
                    </div>

                    <br/>
                    <div>

                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                                    Previous
                                </button>
                            </li>

                            <li className={`page-item ${currentPage === 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(1)}>
                                    1
                                </button>
                            </li>

                            {currentPage > 3 && (
                                <li className="page-item">
                                    <span className="page-link">...</span>
                                </li>
                            )}

                            {currentPage > 2 && (
                                <li className={`page-item ${currentPage - 1 === 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                                        {currentPage - 1}
                                    </button>
                                </li>
                            )}

                            {currentPage !== 1 && currentPage !== totalPages && (
                                <li className="page-item active">
                                    <button className="page-link" onClick={() => handlePageChange(currentPage)}>
                                        {currentPage}
                                    </button>
                                </li>
                            )}

                            {currentPage < totalPages - 1 && (
                                <li className={`page-item ${currentPage + 1 === totalPages ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                                        {currentPage + 1}
                                    </button>
                                </li>
                            )}

                            {currentPage < totalPages - 2 && (
                                <li className="page-item">
                                    <span className="page-link">...</span>
                                </li>
                            )}

                            {totalPages !== 1 && (
                                <li className={`page-item ${currentPage === totalPages ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(totalPages)}>
                                        {totalPages}
                                    </button>
                                </li>
                            )}

                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                                    Next
                                </button>
                            </li>
                        </ul>

                    </div>

                </div>
                : ""}
            {data.length===0  ? <div>
                <br/>
                <br/>
                <h5><i><center>You do not follow any person.</center></i></h5>
            </div>: ''}

        </div>
    );
}

export default ViewFollowedPeoplePage;