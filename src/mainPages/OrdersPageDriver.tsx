import {useLocation} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {findUsernameByToken} from "../api/authorization/authorizationService";
import {
    findAllOrdersAcceptedByUser,
    findAllOrdersGraph,
    findAllOrdersLocations,
    findOrdersGraphShortestPath,
    findRecommendedRoute,
    findShortestPathThroughAllLocations,
    updateOrderStatus
} from "../api/order/orderService";
import OrderSentResponse from "./OrderSentResponse";
import HomePageDriverMap, {MapHandles} from "../utils/HomePageDriverMap";
import { LoadScript } from "@react-google-maps/api";
import {createPairs, pairLocations} from "../utils/UtilsFunctions";
import {GOOGLE_MAPS_API_KEY} from "../GoogleMapsAPIkey";

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
interface Location {
    id: string;
    latitude: number;
    longitude: number;
    idOrder: number;
    type: string;
    name: string;
    orderValue: number;
}

interface LocationGraphEdge {
    from: Location;
    to: Location;
    distance: number;
}

function OrdersPageDriver() {


    const itemsPerPage=6;
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedData, setPaginatedData] = useState<Order[]>([]);
    const [data,setData]=useState<Order[]>([]);
    const [totalPages,setTotalPages]=useState(1);
    const [viewOrderMoreInformation,setViewOrderMoreInformation] =useState(false);
    const [clickedRowOrder,setClickedRowOrder]=useState<Order | null>(null);
    const [orderCancelledMessage,setOrderCancelledMessage]=useState("");
    const [currentStatus,setCurrentStatus]=useState('');
    const [username,setUsername]=useState("");
    const [ordersLocations,setOrdersLocations]=useState<Location[]>([]);
    const [locationPairs,setLocationPairs]=useState<[Location, Location][]>([]);

    const [showLocations,setShowLocations]=useState(false);
    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        findUsernameByToken(localStorage.getItem('token')).then(username => {
            findAllOrdersAcceptedByUser(username).then(data => {
                setData(data);
                setTotalPages(Math.ceil(data.length / itemsPerPage))
                setPaginatedData(data.slice(startIndex, endIndex));
            });
        })
    }, [currentPage, itemsPerPage]);

    useEffect(()=>{
        findUsernameByToken(localStorage.getItem('token')).then(username => {
            setUsername(username);
            findAllOrdersGraph(username).then(data=>{
                setLocationPairs(data.map((item:LocationGraphEdge) => {
                    return [item.from, item.to];
                }));
            });
            findAllOrdersLocations(username).then(data=>{
                setOrdersLocations(data);
            });
        })},[]);


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

    const finalizeOrderButtonClicked=(id:number)=>{
        updateOrderStatus("DELIVERED",id).then(res=>{
            const searchedObject = data.find(order => order.id === id);
            if (searchedObject) {
                setOrderCancelledMessage("Order was marked as delivered successfully!");
                searchedObject.status="DELIVERED";
            }
        });
    }

    const mapRef = useRef<MapHandles | null>(null);

    function OrderMoreInformation(givenOrder: OrderMoreInformationProps) {
        const order = givenOrder.order;

        if(order===null)
            return <p>Internal server error</p>
        else
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
                        <li className="list-group-item orderConfirmation"><b>Status:</b> {order.status}</li>
                        <li className="list-group-item orderConfirmation"><b>Transport type:</b> {order.transportType}</li>
                        <li className="list-group-item orderConfirmation"><b>Weight:</b> {typeof order.weight === 'number' ? order.weight : 'not specified'}</li>
                        <li className="list-group-item orderConfirmation"><b>Number of items:</b> {typeof order.numberOfItems === 'number' ? order.numberOfItems : 'not specified'}</li>
                        <li className="list-group-item orderConfirmation"><b>Pickup date:</b> {typeof order.pickupDate === 'string' ? order.pickupDate : 'not specified'}</li>
                        <li className="list-group-item orderConfirmation"><b>Additional information:</b> {typeof order.additionalInformation === 'string' ? order.additionalInformation : 'not specified'}</li>
                        <li className="list-group-item orderConfirmation"><b>Cost:</b> {typeof order.cost === 'number' ? order.cost : 'not specified'}</li>
                        <li className="list-group-item orderConfirmation"><b>Driver:</b> {typeof order.acceptedByUsername === 'string' ? order.acceptedByUsername : '-'}</li>
                        <li className="list-group-item orderConfirmation"><b>Estimated pickup time:</b> {typeof order.pickupTime === 'string' ? order.pickupTime : '-'}</li>
                        <li className="list-group-item orderConfirmation"><b>Estimated arrival to destination time:</b> {typeof order.arrivalToDestinationTime === 'string' ? order.arrivalToDestinationTime : '-'}</li>
                    </ul>
                    <br/>
                    {orderCancelledMessage==="" ?  '' : <h5 style={{color:"green"}}>{orderCancelledMessage}</h5>}
                    <br/>
                    {order.status === "PENDING" &&
                    <div className="d-flex">
                        <button type="button" className="btn btn-danger addSpaceNearElement" style={{width: "8rem"}}
                                onClick={() => cancelOrderButtonClicked(order.id)}>Cancel
                        </button>
                        <button type="button" className="btn btn-primary addSpaceNearElement"
                                style={{width: "8rem", backgroundColor: "green"}}
                                onClick={() => finalizeOrderButtonClicked(order.id)}>Finalize
                        </button>

                    </div>
                    }
                </div>
            );
    }

    const getLocationNameById = (givenId: string): string => {
        for (const location of ordersLocations) {
            if (location.id === givenId) {
                return location.name;
            }
        }
        return '';
    };

    function changeShowLocationsView(){
        if(showLocations)
            setShowLocations(false)
        else
            setShowLocations(true)
    }



    const googleMapsApiKey=GOOGLE_MAPS_API_KEY;
    const [isLoaded,setIsLoaded]=useState(false);
    const [selectedMapOptionText, setSelectedMapOptionText] = useState('Plan pending orders');
    const [selectedMapOption,setSelectedMapOption]=useState(0);
    const [waitingForResponse,setWaitingForResponse]=useState(false);

    const handleGenerateShortestPath = () => {
        setSelectedMapOptionText('Fastest route between 2 locations that goes through other locations');
        setSelectedMapOption(1);
        setShortestPath([]);
    };

    const handleGenerateShortestPathThroughAllLocations = () => {
        setSelectedMapOptionText('Generate shortest path that goes through all locations');
        setSelectedMapOption(2);
        setShortestPath([]);
    };

    const handleGenerateRecommendedPath = () => {
        setSelectedMapOptionText('Generate possible path to travel through your locations to pick up and deliver orders');
        setSelectedMapOption(3);
        setShortestPath([]);
    };

    const [shortestPathFirstLocation,setShortestPathFirstLocation]=useState('0');
    const [shortestPathSecondLocation,setShortestPathSecondLocation]=useState('0');

    const handleShortestPathFirstLocationChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setShortestPathFirstLocation(event.target.value);
    };
    const handleShortestPathSecondLocationChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setShortestPathSecondLocation(event.target.value);
    };
    const handleOrderTypeChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setOrderType(event.target.value);
    };

    const [shortestPath,setShortestPath]=useState<string[]>([]);
    const [orderType,setOrderType]=useState("ORIGIN");

    const groupElements = (array: string[], chunkSize: number) => {
        const result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize));
        }
        return result;
    };

    const groupedShortestPath = groupElements(shortestPath, 4);
    const [selectedLocationOptions, setSelectedLocationOptions] = useState<string[]>([]);

    const handleCheckboxChange = (locationId: string, isChecked: boolean) => {
        if (isChecked) {
            setSelectedLocationOptions((prevSelected) => [...prevSelected, locationId]);
        } else {
            setSelectedLocationOptions((prevSelected) => prevSelected.filter((id) => id !== locationId));
        }
    };

    const renderLocationsShortestPath = () => {
        const rows: JSX.Element[][] = [];
        let row: JSX.Element[] = [];

        ordersLocations.forEach((location, index) => {
            const isChecked = selectedLocationOptions.includes(location.id);
            row.push(
                <div key={location.id} style={{ display: 'inline-block', margin: '0 10px 10px 0' }}>

                <label key={location.id} style={{"color":"#040472"}}>
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleCheckboxChange(location.id, e.target.checked)}
                    />
                    {location.name}
                </label>,
                    </div>
            );

            if ((index + 1) % 3 === 0 || index === ordersLocations.length - 1) {
                rows.push(row);
                row = [];
            }
        });

        return rows.map((rowItems, index) => (
            <div key={index} className="location-row">
                {rowItems}
            </div>
        ));
    }

    const generateMapOptionResult = () =>{
        if(selectedMapOption==1){
            findOrdersGraphShortestPath(username,shortestPathFirstLocation,shortestPathSecondLocation,selectedLocationOptions).then(shortestPath=>{
                setShortestPath(shortestPath)
                if (mapRef.current) {
                    mapRef.current.changeRouteColor(createPairs(shortestPath))
                }
            });
        }
        if(selectedMapOption==2){
            findShortestPathThroughAllLocations(username,shortestPathFirstLocation).then(shortestPath=>{
                setShortestPath(shortestPath);
                if (mapRef.current) {
                    mapRef.current.changeRouteColor(createPairs(shortestPath))
                }
            });
        }
        if(selectedMapOption==3){
            setWaitingForResponse(true);
            findRecommendedRoute(username,shortestPathFirstLocation).then(shortestPath=>{
                setWaitingForResponse(false);
                setShortestPath(shortestPath);
                if (mapRef.current) {
                    mapRef.current.changeRouteColor(createPairs(shortestPath))
                }
            });
        }
    }


    return (
        <div>
            {
                viewOrderMoreInformation ? <OrderMoreInformation order={clickedRowOrder}/> :
                    <div className="homePageClientDiv">
                        <div className="d-flex">
                            <img src="/icon/orderIcon.png" style={{width: "1.6rem", height: "1.6rem"}} alt="logo"/>
                            <i><h4 className="addSpaceNearElement" style={{color: "#244a7c"}}>Taken orders:</h4></i>
                        </div>
                        <hr/>

                        {showLocations ?
                            <>
                            <LoadScript googleMapsApiKey={googleMapsApiKey} onLoad={() => setIsLoaded(true)}>
                                {isLoaded && (
                                    <>
                                <HomePageDriverMap ref={mapRef} locations={ordersLocations} locationPairs={pairLocations(ordersLocations)} />
                                <br/>
                                <div className="dropdown">
                                    <center>
                                    <button className="btn btn-outline-primary dropdown-toggle" type="button" id="dropdownMenuButton"
                                            style={{width:"auto"}}  data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        {selectedMapOptionText}
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <a className="dropdown-item" onClick={handleGenerateShortestPath} >Shortest route between 2 locations that goes through other locations</a>
                                        <a className="dropdown-item" onClick={handleGenerateShortestPathThroughAllLocations} >Generate shortest path that goes through all locations</a>
                                        <a className="dropdown-item" onClick={handleGenerateRecommendedPath} >Generate possible path to travel through your locations to pick up and deliver orders</a>
                                    </div>
                                        {selectedMapOption==1 && (<>
                                            <br/>
                                            <br/>
                                            <label className="clientFormDiv">
                                                <h6>Location 1:</h6>
                                            </label>
                                            <br/>
                                            <select className="clientFormDiv" style={{"width":"auto"}} onChange={handleShortestPathFirstLocationChanged}>
                                                <option value="0">Select a location</option>
                                                {ordersLocations.map((location) => (
                                                    <option key={location.id} value={location.id}>
                                                        {location.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <br/>
                                            <label className="clientFormDiv">
                                                <h6>Location 2:</h6>
                                            </label>
                                            <br/>
                                            <select className="clientFormDiv" style={{"width":"auto"}} onChange={handleShortestPathSecondLocationChanged}>
                                                <option value="0">Select a location</option>
                                                {ordersLocations.map((location) => (
                                                    <option key={location.id} value={location.id}>
                                                        {location.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <br/>
                                            <br/>
                                            <p style={{"color":"#040472"}}>Other locations that need to be crossed:</p>
                                            <div>{renderLocationsShortestPath()}</div>
                                            <br/>
                                            <button type="button" className="btn btn-primary" style={{width:"40vh"}} onClick={generateMapOptionResult}>Generate</button>
                                            <br/>
                                            <br/>
                                            {shortestPath.length!=0 && (
                                                <div>
                                                    <p style={{"color":"#040472"}}>Shortest path:</p>
                                                    {groupedShortestPath.map((group, groupIndex) => (
                                                        <p key={groupIndex} style={{"color":"#040472"}}>
                                                            {group
                                                                .map((item, index) => `${groupIndex * 4 + index + 1}. ${getLocationNameById(item)}`)
                                                                .join(', ')}
                                                        </p>
                                                    ))}
                                                </div>
                                            )}
                                        </>)}
                                        {selectedMapOption==2 && (<>
                                            <br/>
                                            <br/>
                                            <label className="clientFormDiv">
                                                <h6>Starting location:</h6>
                                            </label>
                                            <br/>
                                            <select className="clientFormDiv" style={{"width":"auto"}} onChange={handleShortestPathFirstLocationChanged}>
                                                <option value="0">Select a location</option>
                                                {ordersLocations.map((location) => (
                                                    <option key={location.id} value={location.id}>
                                                        {location.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <br/>
                                            <br/>
                                            <p style={{"color":"#040472"}}>This option will try to find a path that goes through all locations on the shortest way possible.</p>
                                            <br/>
                                            <button type="button" className="btn btn-primary" style={{width:"40vh"}} onClick={generateMapOptionResult}>Generate</button>
                                            <br/>
                                            <br/>
                                            {shortestPath.length!=0 && (
                                                <div>
                                                    <p style={{"color":"#040472"}}>One possible way to travel through the locations is:</p>
                                                    {groupedShortestPath.map((group, groupIndex) => (
                                                        <p key={groupIndex} style={{"color":"#040472"}}>
                                                            {group
                                                                .map((item, index) => `${groupIndex * 4 + index + 1}. ${getLocationNameById(item)}`)
                                                                .join(', ')}
                                                        </p>
                                                    ))}
                                                </div>
                                            )}
                                        </>)}
                                        {selectedMapOption==3 && (<>
                                            <br/>
                                            <br/>
                                            <label className="clientFormDiv">
                                                <h6>Starting location:</h6>
                                            </label>
                                            <br/>
                                            <select className="clientFormDiv" style={{"width":"auto"}} onChange={handleShortestPathFirstLocationChanged}>
                                                <option value="0">Select a location</option>
                                                {ordersLocations.map((location) => (
                                                    <option key={location.id} value={location.id}>
                                                        {location.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <br/>
                                            <br/>
                                            <p style={{"color":"#040472"}}>This option will try to find an efficient path that contains as many locations as possible in order to help you to pickup and deliver your orders.</p>
                                            <p style={{"color":"#040472"}}>A pickup location for an order will be chosen before its corresponding destination location</p>
                                            <br/>
                                            <button type="button" className="btn btn-primary" style={{width:"40vh"}} onClick={generateMapOptionResult}>Generate</button>
                                            <br/>
                                            <br/>
                                            {waitingForResponse && (
                                                <p style={{"color":"#040472"}}><i>Waiting for response...</i></p>
                                            )
                                            }
                                            {shortestPath.length!=0 && (
                                                <div>
                                                    <p style={{"color":"#040472"}}>One possible way to travel through the locations is:</p>
                                                    {groupedShortestPath.map((group, groupIndex) => (
                                                        <p key={groupIndex} style={{"color":"#040472"}}>
                                                            {group
                                                                .map((item, index) => `${groupIndex * 4 + index + 1}. ${getLocationNameById(item)}`)
                                                                .join(', ')}
                                                        </p>
                                                    ))}
                                                </div>
                                            )}
                                        </>)}
                                    <br/>
                                    <br/>
                                        {selectedMapOption==0 &&(
                                        <button type="button" className="btn btn-primary" style={{width:"40vh"}} onClick={generateMapOptionResult}>Generate</button>
                                        )}
                                    </center>

                                </div>
                                    </>
                                )}
                            </LoadScript>

                            </>
                        :
                            <button type="button" className="btn btn-primary" style={{textAlign:"left"}} onClick={changeShowLocationsView}>Show location menu</button>
                        }

                        <br/>
                        <br/>
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
                                        <td>{typeof item.acceptedByUsername === 'string' ? item.acceptedByUsername : '-'}</td>
                                        <td>{typeof item.pickupTime === 'string' ? item.pickupTime : '-'}</td>
                                        <td>{typeof item.arrivalToDestinationTime === 'string' ? item.arrivalToDestinationTime : '-'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            {paginatedData.length ?
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
                            : <><h5><i><center>No orders found</center></i></h5></>}
                        </div>

                    </div>
            }
        </div>
    );
}

export default OrdersPageDriver;