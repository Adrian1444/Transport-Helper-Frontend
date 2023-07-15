import {
    useJsApiLoader,
    GoogleMap,
    Autocomplete,
    LoadScript
} from '@react-google-maps/api'
import {useEffect, useRef, useState} from 'react'
import { useLocation } from "react-router-dom";
import {findUsernameByToken, findUserRoleByToken} from "../api/authorization/authorizationService";
import OrderSentResponse from "./OrderSentResponse";
import addTimeStrings from "../utils/DurationsAddition";
import {confirmOrder} from "../api/order/orderService";
import {GOOGLE_MAPS_API_KEY} from "../GoogleMapsAPIkey";

const center = { lat: 48.8584, lng: 2.2945 }

const AcceptOrder = () => {

    const location = useLocation();
    const { order } = location.state;

    const [showDistance,setShowDistance]=useState(false);
    const [map, setMap] = useState(/** @type google.maps.Map */ (null))
    const [mapOriginToDestination, setMapOriginToDestination] = useState(/** @type google.maps.Map */ (null))
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [distanceStartToOrigin, setDistanceStartToOrigin] = useState('')
    const [distanceOriginToDestination, setDistanceOriginToDestination] = useState('')
    const [durationStartToOrigin, setDurationStartToOrigin] = useState('')
    const [durationOriginToDestination, setDurationOriginToDestination] = useState('')

    const [directionRendererStartToOrigin,setDirectionRendererStartToOrigin]=useState(null);
    const [directionRendererOriginToDestination,setDirectionRendererOriginToDestination]=useState(null);
    /** @type React.MutableRefObject<HTMLInputElement> */
    const startRef = useRef()

    const [startLocation,setStartLocation]=useState('');
    const [startDate,setStartDate]=useState('');
    const [startTime,setStartTime]=useState('');

    const [username,setUsername]=useState('');

    const [orderSent,setOrderSent] = useState(false)

    const [mapLoaded, setMapLoaded] = useState(false);


    useEffect(() => {
        findUsernameByToken(localStorage.getItem('token')).then(username => {
            setUsername(username);
        })
    })

    useEffect(() => {
        if (mapLoaded) {
            calculateRouteOriginToDestination();
        }
    }, [mapLoaded,directionRendererOriginToDestination]);

    async function calculateRouteStartToOrigin() {
        directionRendererStartToOrigin.setMap(map);
        if (startRef.current.value === '' ) {
            return
        }

        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService()
        const results = await directionsService.route({
            origin: startRef.current.value,
            destination: order.origin,
            // eslint-disable-next-line no-undef
            travelMode: google.maps.TravelMode.DRIVING,
        })
        directionRendererStartToOrigin.setDirections(results);

        setDistanceStartToOrigin(results.routes[0].legs[0].distance.text)
        setDurationStartToOrigin(results.routes[0].legs[0].duration.text)
        setShowDistance(true);

    }

    async function calculateRouteOriginToDestination() {
        directionRendererOriginToDestination.setMap(mapOriginToDestination);

        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService()
        const results = await directionsService.route({
            origin: order.origin,
            destination: order.destination,
            // eslint-disable-next-line no-undef
            travelMode: google.maps.TravelMode.DRIVING,
        })
        directionRendererOriginToDestination.setDirections(results);

        setDistanceOriginToDestination(results.routes[0].legs[0].distance.text)
        setDurationOriginToDestination(results.routes[0].legs[0].duration.text)

    }

    const handleStartDateChanged = (event) => {
        setStartDate(event.target.value);
    };

    const handleStartTimeChanged = (event) => {
        setStartTime(event.target.value);
    };

    const handleStartLocationChanged = (event) => {
        setStartLocation(event.target.value);
    };

    function handleSubmit(){
        confirmOrder(order.id, username, startDate, startTime, durationStartToOrigin, addTimeStrings(durationStartToOrigin, durationOriginToDestination)).then (r =>setOrderSent(true));
    }

    return (
        <LoadScript  googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]} language="en">
        <div>
            {orderSent ?
                <OrderSentResponse
                    origin={order.origin}
                    destination={order.destination}
                    transportType={order.transportType}
                    weight={order.weight}
                    numberOfItems={order.numberOfItems}
                    pickupDate={order.pickupDate}
                    additionalInformation={order.additionalInformation}
                    perspective={"driver"}
                /> :
                <div className="row clientFormContainer">
                    <div className="col-lg-6">
                        <div className="form-wrapper-accept-order">
                            <form className="clientFormDiv">
                                <label className="clientFormDiv">
                                    <h6>Order information:</h6>
                                </label>
                                <ul className="list-group list-group-flush ">
                                    <li className="list-group-item orderConfirmation"><b>Origin:</b> {order.origin}</li>
                                    <li className="list-group-item orderConfirmation"><b>Destination:</b> {order.destination}</li>
                                    <li className="list-group-item orderConfirmation"><b>Transport type:</b> {order.transportType}</li>
                                    <li className="list-group-item orderConfirmation"><b>Weight:</b> {typeof order.weight === 'string' ? order.weight : 'not specified'}</li>
                                    <li className="list-group-item orderConfirmation"><b>Number of items:</b> {typeof order.numberOfItems === 'string' ? order.numberOfItems : 'not specified'}</li>
                                    <li className="list-group-item orderConfirmation"><b>Pickup date:</b> {typeof order.pickupDate === 'string' ? order.pickupDate : 'not specified'}</li>
                                    <li className="list-group-item orderConfirmation"><b>Additional information:</b> {typeof order.additionalInformation === 'string' ? order.additionalInformation : 'not specified'}</li>
                                    <li className="list-group-item orderConfirmation"><b>Placed by:</b> {typeof order.placedByUsername === 'string' ? order.placedByUsername : 'not specified'}</li>
                                </ul>
                                <br/>
                                <label className="clientFormDiv">
                                    <h6>Location from where you start going to the pick up location:</h6>
                                </label>
                                <Autocomplete>
                                    <input
                                        type='text'
                                        placeholder='Pick-up location'
                                        ref={startRef}
                                        className="clientFormDiv"
                                        onBlur={event=>{calculateRouteStartToOrigin(); handleStartLocationChanged(event)}}
                                        required
                                    />
                                </Autocomplete>
                                <label className="clientFormDiv">
                                    <h6>Starting traveling date:</h6>
                                </label>
                                <input type="date" id="pick-up-date" name="pick-up-date" className="clientFormDiv" onChange={handleStartDateChanged} required/>
                                <label className="clientFormDiv">
                                    <h6>Starting traveling time:</h6>
                                </label>
                                <input type="time" id="time-input" className="clientFormDiv" onChange={handleStartTimeChanged} name="time-input"/>

                                {showDistance ?
                                    <div>
                                        <label className="clientFormDiv">
                                            <h6>Driving time from starting point to pick up: {durationStartToOrigin}</h6>
                                        </label>
                                    </div> : ''}
                                {showDistance ?
                                    <div>
                                        <label className="clientFormDiv">
                                            <h6>Total driving time: {addTimeStrings(durationStartToOrigin,durationOriginToDestination)}</h6>
                                        </label>
                                    </div> : ''}
                                <input type="button" value="Take order" className="clientFormDiv" onClick={handleSubmit}/>
                            </form>
                        </div>
                    </div>
                    <div className="googleMapsSmallBox col-lg-6">
                        {/* Google FindDriverPage Box */}
                        <h6 style={{color:"#07539a"}}>Your starting position to order origin route:</h6>
                        <GoogleMap
                            center={center}
                            zoom={4}
                            mapContainerStyle={{ width: '100%', height: '100%' }}
                            options={{
                                zoomControl: false,
                                streetViewControl: false,
                                mapTypeControl: false,
                                fullscreenControl: false,
                            }}
                            onLoad={map => {
                                // eslint-disable-next-line no-undef
                                setDirectionRendererStartToOrigin(new google.maps.DirectionsRenderer());
                                setMap(map);
                            }}
                        >
                        </GoogleMap>
                        {showDistance ?
                            <div>
                                <label className="clientFormDiv">
                                    <h6>Starting point to origin distance: {distanceStartToOrigin}</h6>
                                </label>
                            </div> : ''}
                        <h6 style={{color:"#07539a"}}>Order origin position to destination route:</h6>
                        <GoogleMap
                            center={center}
                            zoom={4}
                            mapContainerStyle={{ width: '100%', height: '100%' }}
                            options={{
                                zoomControl: false,
                                streetViewControl: false,
                                mapTypeControl: false,
                                fullscreenControl: false,
                            }}
                            onLoad={map => {
                                // eslint-disable-next-line no-undef
                                setDirectionRendererOriginToDestination(new google.maps.DirectionsRenderer());
                                setMapOriginToDestination(map);
                                setMapLoaded(true);
                            }}
                        >
                        </GoogleMap>
                        <label className="clientFormDiv">
                            <h6>Origin to destination distance: {distanceOriginToDestination}</h6>
                        </label>
                        {showDistance && !distanceOriginToDestination.includes("m") && !distanceStartToOrigin.includes("m") ?
                            <div>
                                <label className="clientFormDiv">
                                    <h6>Total distance: {parseFloat(distanceOriginToDestination.slice(0, -3)) + parseFloat(distanceStartToOrigin.slice(0, -3))}</h6>
                                </label>
                            </div> : ''}
                        <br/>
                        <br/>

                    </div>
                </div>

            }

        </div>
        </LoadScript>
    )
}

export default AcceptOrder;