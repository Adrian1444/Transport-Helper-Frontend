import {
    Autocomplete, LoadScript
} from '@react-google-maps/api'
import React, {useEffect, useState} from "react";
import {UserData} from "./ProfilePage";
import {filterOrders, searchUsers} from "../api/order/orderService";
import AcceptOrder from "./AcceptOrder";
import {useNavigate} from "react-router-dom";
import {findUsernameByToken} from "../api/authorization/authorizationService";

function SearchUsers(){
    const navigate = useNavigate();

    function searchButtonClicked(){
        setShowResults(true);
        setUpdateData(updateData+1);
    }

    const itemsPerPage=10;
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedData, setPaginatedData] = useState<UserData[]>([]);
    const [data,setData]=useState<UserData[]>([]);
    const [totalPages,setTotalPages]=useState(1);

    const [showResults,setShowResults]=useState(false);
    const [updateData,setUpdateData]=useState(0);

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        if(showResults && searchString) {
            findUsernameByToken(localStorage.getItem('token')).then(username => {
                searchUsers(username,searchString).then(data => {
                    setData(data);
                    setTotalPages(Math.ceil(data.length / itemsPerPage))
                    setPaginatedData(data.slice(startIndex, endIndex));
                })
            })
        }
    }, [updateData,currentPage, itemsPerPage]);

    const handlePageChange = (page: number) => {
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    };

    const [searchString,setSearchString]=useState('');

    const handleSearchStringChanged = (event: any) => {
        setSearchString(event.target.value);
    };

    const viewUserProfileButtonClicked = (user: UserData) => {
        navigate("/profile/driver/"+user.username, {
        })
    }

    return(
        <div className="homePageClientDiv">
                <center>
                <div className="input-group rounded" style={{width: "35rem" }}>

                    <input type="search" className="form-control rounded" placeholder="Search other drivers" aria-label="Search"
                           aria-describedby="search-addon" onChange={handleSearchStringChanged}/>
                    <span className="input-group-text border-0" id="search-addon" style={{backgroundColor:"#06a6e1"}}>
                      <img src="/icon/searchIcon.png"  style={{width: "1rem" ,height:"1rem",cursor:"pointer"}} alt="searchIcon" onClick={searchButtonClicked}/>
                    </span>

                </div>
                </center>

                {data.length && showResults ?
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
                {data.length===0 && showResults && searchString ? <div>
                    <br/>
                    <br/>
                    <h5><i><center>No results found for your filter criteria</center></i></h5>
                </div>: ''}

        </div>
    );
}

export default SearchUsers;