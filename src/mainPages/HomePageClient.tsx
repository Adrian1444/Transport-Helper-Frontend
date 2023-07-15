import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {findUsernameByToken} from "../api/authorization/authorizationService";
import {findAllOrdersPlacedByUser, updateOrderStatus} from "../api/order/orderService";
import OrderSentResponse from "./OrderSentResponse";

export interface Order {
    id:number;
    origin: string;
    destination: string;
    transportType: string;
    weight: unknown;
    numberOfItems: unknown;
    pickupDate: unknown;
    additionalInformation: unknown;
    placedByUsername:string;
    acceptedByUsername: unknown;
    status: string;
    timestamp: string;
    cost: unknown;
    pickupTime: unknown;
    arrivalToDestinationTime: unknown;
}

interface OrderMoreInformationProps {
    order: Order | null;
}


function HomePageClient() {


    const itemsPerPage=6;
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedData, setPaginatedData] = useState<Order[]>([]);
    const [data,setData]=useState<Order[]>([]);
    const [totalPages,setTotalPages]=useState(1);
    const [viewOrderMoreInformation,setViewOrderMoreInformation] =useState(false);
    const [clickedRowOrder,setClickedRowOrder]=useState<Order | null>(null);
    const [orderCancelledMessage,setOrderCancelledMessage]=useState("");

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        findUsernameByToken(localStorage.getItem('token')).then(username => {
            findAllOrdersPlacedByUser(username).then(data => {
                setData(data);
                setTotalPages(Math.ceil(data.length / itemsPerPage))
                setPaginatedData(data.slice(startIndex, endIndex));
            })
        })
    }, [currentPage, itemsPerPage]);

    const handlePageChange = (page: number) => {
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    };

    const viewMoreInformationButtonClicked = (item: Order) =>{
        setClickedRowOrder(item);
        setViewOrderMoreInformation(true);
    };

    const backToMainMenuButtonClicked =() =>{
        setViewOrderMoreInformation(false);
    }

    const cancelOrderButtonClicked=(id:number)=>{
        updateOrderStatus("CANCELLED",id).then(res=>{
            const searchedObject = data.find(order => order.id === id);
            if (searchedObject) {
                setOrderCancelledMessage("Order was cancelled successfully!");
                searchedObject.status="CANCELLED";
            }
        });
    }

    const navigate = useNavigate();

    const viewUserProfileButtonClicked = (username: string|unknown) => {
        if(!username)
            return;
        navigate("/profile/client/"+username, {
        })
    }

    function OrderMoreInformation(givenOrder: OrderMoreInformationProps) {
        const order = givenOrder.order;
        if(order===null)
            return <p>Internal server error</p>
        else
        {
            return(
                        <div className="homePageClientDiv">
                            <button type="button" className="btn btn-link" style={{textAlign:"left"}} onClick={backToMainMenuButtonClicked}>Back to the main menu</button>
                            <br/>
                            <br/>
                            <div className="d-flex">
                                <img src="/icon/orderIcon.png" style={{width: "1.6rem", height: "1.6rem"}} alt="logo"/>
                                <i><h4 className="addSpaceNearElement" style={{color: "#244a7c"}}>Order information:</h4></i>
                            </div>
                            <ul className="list-group list-group-flush ">
                                <li className="list-group-item orderConfirmation"><b>Timestamp::</b> {order.timestamp}</li>
                                <li className="list-group-item orderConfirmation"><b>Origin:</b> {order.origin}</li>
                                <li className="list-group-item orderConfirmation"><b>Destination:</b> {order.destination}</li>
                                <li className="list-group-item orderConfirmation"><b>Status:</b> {orderCancelledMessage==="" ? order.status: 'CANCELLED'}</li>
                                <li className="list-group-item orderConfirmation"><b>Transport type:</b> {order.transportType}</li>
                                <li className="list-group-item orderConfirmation"><b>Weight:</b> {typeof order.weight === 'number' ? order.weight : 'not specified'}</li>
                                <li className="list-group-item orderConfirmation"><b>Number of items:</b> {typeof order.numberOfItems === 'number' ? order.numberOfItems : 'not specified'}</li>
                                <li className="list-group-item orderConfirmation"><b>Pickup date:</b> {typeof order.pickupDate === 'string' ? order.pickupDate : 'not specified'}</li>
                                <li className="list-group-item orderConfirmation"><b>Additional information:</b> {typeof order.additionalInformation === 'string' ? order.additionalInformation : 'not specified'}</li>
                                <li className="list-group-item orderConfirmation"><b>Cost:</b> {typeof order.cost === 'number' ? order.cost : 'not specified'}</li>
                                <li className="list-group-item orderConfirmation"><b>Driver:</b> <u style={{color:"blue",cursor:"pointer"}} onClick={()=>viewUserProfileButtonClicked(order.acceptedByUsername)}> {typeof order.acceptedByUsername === 'string' ? order.acceptedByUsername : '-'} </u></li>
                                <li className="list-group-item orderConfirmation"><b>Estimated pickup time:</b> {typeof order.pickupTime === 'string' ? order.pickupTime : '-'}</li>
                                <li className="list-group-item orderConfirmation"><b>Estimated arrival to destination time:</b> {typeof order.arrivalToDestinationTime === 'string' ? order.arrivalToDestinationTime : '-'}</li>
                            </ul>
                            <br/>
                                {orderCancelledMessage==="" ? <h5 style={{color:"green"}}>{orderCancelledMessage}</h5> : ''}
                                <div className="d-flex">
                                    <button type="button" className="btn btn-danger addSpaceNearElement" style={{width:"8rem"}} onClick={()=>cancelOrderButtonClicked(order.id)}>Cancel</button>
                                </div>
                            <hr/>
                        </div>
                    );
        }
    }
    return (
        <div>
        {
            viewOrderMoreInformation ? <OrderMoreInformation order={clickedRowOrder}/> :
                <div className="homePageClientDiv">
                    <div className="d-flex">
                        <img src="/icon/orderIcon.png" style={{width: "1.6rem", height: "1.6rem"}} alt="logo"/>
                        <i><h4 className="addSpaceNearElement" style={{color: "#244a7c"}}>Placed orders:</h4></i>
                    </div>
                    <hr/>
                    {data.length!=0 ? <>
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered">
                            <thead>
                            <tr className="homePageClientTable">
                                <th style={{textAlign: "center", verticalAlign: "middle"}}>Timestamp</th>
                                <th style={{textAlign: "center", verticalAlign: "middle"}}>View information</th>
                                <th className="hidden-on-small-screens"
                                    style={{textAlign: "center", verticalAlign: "middle"}}>Origin
                                </th>
                                <th className="hidden-on-small-screens"
                                    style={{textAlign: "center", verticalAlign: "middle"}}>Destination
                                </th>
                                <th className="hidden-on-small-screens"
                                    style={{textAlign: "center", verticalAlign: "middle"}}>Transport type
                                </th>
                                <th className="hidden-on-small-screens"
                                    style={{textAlign: "center", verticalAlign: "middle"}}>Cost
                                </th>
                                <th style={{textAlign: "center", verticalAlign: "middle"}}>Status</th>
                                <th style={{textAlign: "center", verticalAlign: "middle"}}>Driver</th>
                                <th style={{textAlign: "center", verticalAlign: "middle"}}>Estimated pick up time:</th>
                                <th style={{textAlign: "center", verticalAlign: "middle"}}>Estimated destination arrival
                                    time:
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {paginatedData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.timestamp}</td>
                                    <td>
                                        <center>
                                            <button type="button" className="btn btn-success" style={{color: "white"}}
                                                    onClick={() => viewMoreInformationButtonClicked(item)}>View
                                            </button>
                                        </center>
                                    </td>
                                    <td className="hidden-on-small-screens">{item.origin}</td>
                                    <td className="hidden-on-small-screens">{item.destination}</td>
                                    <td className="hidden-on-small-screens">{item.transportType}</td>
                                    <td className="hidden-on-small-screens">{typeof item.cost === 'number' ? item.cost : '-'}</td>
                                    <td>{typeof item.status === 'string' ? item.status : '-'}</td>
                                    <td><u style={{cursor:"pointer"}} onClick={()=>viewUserProfileButtonClicked(item.acceptedByUsername)}>{typeof item.acceptedByUsername === 'string' ? item.acceptedByUsername : '-'}</u></td>
                                    <td>{typeof item.pickupTime === 'string' ? item.pickupTime : '-'}</td>
                                    <td>{typeof item.arrivalToDestinationTime === 'string' ? item.arrivalToDestinationTime : '-'}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
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
                    </> : <h5><i><center>No orders found</center></i></h5>}
                </div>
        }
        </div>
    );
}

export default HomePageClient;