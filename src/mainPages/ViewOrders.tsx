import {
    Autocomplete, LoadScript
} from '@react-google-maps/api'
import React, {useEffect, useState} from "react";
import {Order} from "./HomePageClient";
import {filterOrders} from "../api/order/orderService";
import AcceptOrder from "./AcceptOrder";
import {useNavigate} from "react-router-dom";
import {GOOGLE_MAPS_API_KEY} from "../GoogleMapsAPIkey";

function ViewOrders(){
    const [showFilterMenu,setShowFilterMenu]=useState(true);
    const navigate = useNavigate();

    function filterButtonClicked(){
        setShowResults(true);

        if(showFilterMenu) {
            setShowFilterMenu(false);
            setUpdateData(updateData+1);
        }else{
            setShowFilterMenu(true);
        }
    }

    const itemsPerPage=10;
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedData, setPaginatedData] = useState<Order[]>([]);
    const [data,setData]=useState<Order[]>([]);
    const [totalPages,setTotalPages]=useState(1);

    const [showResults,setShowResults]=useState(false);
    const [updateData,setUpdateData]=useState(0);

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        if(showResults) {
            filterOrders(origin,destination,typeOfTransport,minWeight,maxWeight,minNumberOfItems,maxNumberOfItems,pickupDate,minCost,maxCost).then(data => {
                setData(data);
                setTotalPages(Math.ceil(data.length / itemsPerPage))
                setPaginatedData(data.slice(startIndex, endIndex));
                setDestination('');
                setOrigin('');
                setTypeOfTransport([]);
                setMinWeight(null);
                setMaxWeight(null);
                setMinNumberOfItems(null);
                setMaxNumberOfItems(null);
                setMinCost(null);
                setMinCost(null);
                setPickupDate(null);
            })
        }
    }, [updateData,currentPage, itemsPerPage]);

    const handlePageChange = (page: number) => {
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    };

    const [origin,setOrigin]=useState('');
    const [destination,setDestination]=useState('');
    const [typeOfTransport, setTypeOfTransport] = useState<string[]>([]);
    const [minWeight,setMinWeight]=useState(null);
    const [maxWeight,setMaxWeight]=useState(null);

    const [minNumberOfItems,setMinNumberOfItems]=useState(null);
    const [maxNumberOfItems,setMaxNumberOfItems]=useState(null);

    const [minCost,setMinCost]=useState(null);
    const [maxCost,setMaxCost]=useState(null);

    const [pickupDate,setPickupDate]=useState(null);

    const handleTransportTypeChanged = (event: any) => {
        setTypeOfTransport([...typeOfTransport, event.target.value]);
    };

    const handleDestinationChanged = (event : any) => {
        setDestination(event.target.value);
    };

    const handleOriginChanged = (event: any) => {
        setOrigin(event.target.value);
    };

    const handleMinWeightChanged = (event: any) => {
        setMinWeight(event.target.value);
    };

    const handleMaxWeightChanged = (event: any) => {
        setMaxWeight(event.target.value);
    };

    const handleMinNumberOfItemsChanged = (event: any) => {
        setMinNumberOfItems(event.target.value);
    };

    const handleMaxNumberOfItemsChanged = (event: any) => {
       setMaxNumberOfItems(event.target.value);
    };
    const handlePickupDateChanged = (event: any) => {
       setPickupDate(event.target.value);
    };

    const handleMinCostChanged = (event: any) => {
        setMinCost(event.target.value);
    };

    const handleMaxCostChanged = (event: any) => {
        setMaxCost(event.target.value);
    };
    const viewMoreInformationButtonClicked = (item: Order) => {
        navigate("/view/order/information", {
            state: {
                order: item
            }
        })
    }

        return(
        <div className="homePageClientDiv">
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]} language="en">

            {showFilterMenu ?
        <div className="row">
            <div className="col-lg">
            <label className="clientFormDiv" style={{fontSize:"0.9rem"}}>
                <b>Origin:</b>
            </label>
                <br/>
                <Autocomplete>
                <input
                    type='text'
                    placeholder='Place to pick up order'
                    className="clientFormDiv"
                    style={{ height:"1.5rem"}}
                    onBlur={event=>{ handleOriginChanged(event)}}

                />
            </Autocomplete>
            <label className="clientFormDiv" style={{fontSize:"0.9rem"}}>
                <b>Destination:</b>
            </label>
                <br/>
                <Autocomplete>
                <input
                    type='text'
                    placeholder='Destination for the order'
                    className="clientFormDiv"
                    style={{ height:"1.5rem"}}
                    onBlur={event=>{ handleDestinationChanged(event)}}

                />
            </Autocomplete>
            </div>
            <div className="col-lg col-md">
                <label className="clientFormDiv" style={{fontSize:"0.9rem"}}>
                    <b>Minimum number of items:</b>
                </label>
                <br/>
                <input type='number' className="clientFormDiv" min="1" style={{ height:"1.5rem"}} onChange={handleMinNumberOfItemsChanged}/>
                <br/>
                <label className="clientFormDiv" style={{fontSize:"0.9rem"}}>
                    <b>Maximum number of items:</b>
                </label>
                <br/>
                <input type='number' className="clientFormDiv" min="1" style={{ height:"1.5rem"}} onChange={handleMaxNumberOfItemsChanged}/>
            </div>
            <div className="col-lg-2 col-md">
                <label className="clientFormDiv" style={{fontSize:"0.9rem"}}>
                    <b>Minimum weight:</b>
                </label>
                <br/>

                <input type='number' className="clientFormDiv" min="1" style={{ height:"1.5rem"}} onChange={handleMinWeightChanged}/>
                <br/>
                <label className="clientFormDiv" style={{fontSize:"0.9rem"}}>
                    <b>Maximum weight:</b>
                </label>
                <br/>

                <input type='number' className="clientFormDiv" min="1" style={{ height:"1.5rem"}} onChange={handleMaxWeightChanged}/>
                <br/>

            </div>
            <div className="col-lg col-md">
                <label className="clientFormDiv" style={{fontSize:"0.9rem"}}>
                    <b>Minimum price:</b>
                </label>
                <br/>

                <input type='number' className="clientFormDiv" min="1" style={{ height:"1.5rem"}} onChange={handleMinCostChanged}/>
                <br/>
                <label className="clientFormDiv" style={{fontSize:"0.9rem"}}>
                    <b>Maximum price:</b>
                </label>
                <br/>

                <input type='number' className="clientFormDiv" min="1" style={{ height:"1.5rem"}} onChange={handleMaxCostChanged}/>
                <br/>

            </div>
                <div className="col-lg col-md">
                    <label className="clientFormDiv" style={{fontSize:"0.9rem"}}>
                        <b>Transport type:</b>
                    </label>
                    <br/>

                    <select id="transport" name="transport" className="viewOrdersFilter" style={{ height:"1.5rem"}} onChange={handleTransportTypeChanged} >
                        <option disabled selected> -- select an option -- </option>
                        <option value="SMALL_PACKAGE">Small package</option>
                        <option value="FURNITURE_ELECTRONICS">Furniture/Electronic devices</option>
                        <option value="CAR">Car</option>
                        <option value="SMALL_VEHICLE">Small vehicle</option>
                        <option value="BIG_VEHICLE">Big vehicle</option>
                        <option value="BIKE">Bike/electric scooter</option>
                        <option value="AGRICULTURAL">Vegetables/Fruits/Agricultural products</option>
                        <option value="FOOD_PRODUCTS">Different food products</option>
                        <option value="WOOD">Wood</option>
                        <option value="CONSTRUCTION_MATERIALS">Construction Materials</option>
                        <option value="METALS">Metals</option>
                        <option value="ANIMALS">Animals</option>
                        <option value="RAW_MATERIALS">Different raw materials</option>
                        <option value="OIL">Oil</option>
                        <option value="OTHER">Other</option>
                    </select>
                    <br/>
                    <label className="clientFormDiv" style={{fontSize:"0.9rem",marginTop:"0.8rem"}}>
                        <b>Date to be picked up:</b>
                    </label>
                    <br/>
                    <input type="date" id="pick-up-date" name="pick-up-date" className="clientFormDiv" style={{ height:"1.5rem"}} onChange={handlePickupDateChanged}/>
                </div>
                <center>
                    <button type="button" className="btn btn-info" style={{width:"8rem",color:"white",marginBottom:"1%"}} onClick={filterButtonClicked}>
                        Filter
                    </button>
                </center>
                <hr/>

        </div>
               :
            <div>
                <center>
                    <button type="button" className="btn btn-info" style={{width:"8rem",color:"white"}} onClick={filterButtonClicked}>
                        Filter
                    </button>
                </center>
                <hr/>
            </div>
            }
                {data.length && showResults ?

                <div>
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered">
                            <thead>
                            <tr className="homePageClientTable">
                                <th style={{textAlign: "center", verticalAlign: "middle"}}>Timestamp</th>
                                <th style={{textAlign: "center", verticalAlign: "middle"}}>View information</th>
                                <th
                                    style={{textAlign: "center", verticalAlign: "middle"}}>Origin
                                </th>
                                <th
                                    style={{textAlign: "center", verticalAlign: "middle"}}>Destination
                                </th>
                                <th
                                    style={{textAlign: "center", verticalAlign: "middle"}}>Transport type
                                </th>
                                <th
                                    style={{textAlign: "center", verticalAlign: "middle"}}>Cost
                                </th>
                                <th style={{textAlign: "center", verticalAlign: "middle"}}>Weight</th>
                                <th style={{textAlign: "center", verticalAlign: "middle"}}>No. of items</th>
                                <th style={{textAlign: "center", verticalAlign: "middle"}}>Placed by</th>
                                <th style={{textAlign: "center", verticalAlign: "middle"}}>Pickup time
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
                                    <td>{item.origin}</td>
                                    <td>{item.destination}</td>
                                    <td>{item.transportType}</td>
                                    <td>{typeof item.cost === 'number' ? item.cost : '-'}</td>
                                    <td>{typeof item.weight === 'number' ? item.weight : '-'}</td>
                                    <td>{typeof item.numberOfItems === 'number' ? item.numberOfItems : '-'}</td>
                                    <td>{typeof item.placedByUsername === 'string' ? item.placedByUsername : '-'}</td>
                                    <td>{typeof item.pickupTime === 'string' ? item.pickupTime : '-'}</td>
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
                </div>
                    : ""}
                {data.length===0 && showResults ? <div>
                    <br/>
                    <br/>
                    <h5><i><center>No results found for your filter criteria</center></i></h5>
                </div>: ''}
            </LoadScript>

        </div>
    );
}

export default ViewOrders;