import {
    useJsApiLoader,
    GoogleMap,
    Autocomplete,
} from '@react-google-maps/api'
import {useEffect, useRef, useState} from 'react'
import {addOrder} from "../api/order/orderService";
import {findUsernameByToken, findUserRoleByToken} from "../api/authorization/authorizationService";
import OrderSentResponse from "./OrderSentResponse";
import {GOOGLE_MAPS_API_KEY} from "../GoogleMapsAPIkey";

const center = { lat: 48.8584, lng: 2.2945 }

function FindDriverPage() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ['places'],
        language: "en"
    })

    const [map, setMap] = useState(/** @type google.maps.Map */ (null))
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')
    const [directionRenderer,setDirectionRenderer]=useState(null);
    const [showDistance,setShowDistance]=useState(false);
    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef()
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destiantionRef = useRef()

    const [origin,setOrigin]=useState('');
    const [destination,setDestination]=useState('');
    const [typeOfTransport,setTypeOfTransport]=useState('SMALL_PACKAGE');
    const [weight,setWeight]=useState(null);
    const [numberOfItems,setNumberOfItems]=useState(null);
    const [pickupDate,setPickupDate]=useState(null);
    const [additionalInformation,setAdditionalInformation]=useState(null);
    const [username,setUsername]=useState('');

    const [orderSent,setOrderSent] = useState(false)

    const [latOrigin,setLatOrigin]=useState('')
    const [lngOrigin,setLngOrigin]=useState('')
    const [latDestination,setLatDestination]=useState('');
    const [lngDestination,setLngDestination]=useState('')

    const [cost,setCost]=useState(null);

    useEffect(() => {
        findUsernameByToken(localStorage.getItem('token')).then(username => {
            setUsername(username);
        })
    })

    if (!isLoaded) {
        return <p>Loading page... Please wait</p>
    }

    async function calculateRoute() {
        directionRenderer.setMap(map);
        if (originRef.current.value === '' || destiantionRef.current.value === '') {
            return
        }

        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService()
            const results = await directionsService.route({
                origin: originRef.current.value,
                destination: destiantionRef.current.value,
                // eslint-disable-next-line no-undef
                travelMode: google.maps.TravelMode.DRIVING,
            })
        directionRenderer.setDirections(results);

        const leg = results.routes[0].legs[0];
        const originLatLng = leg.start_location;
        const destinationLatLng = leg.end_location;

        setDistance(leg.distance.text)
        setDuration(leg.duration.text)
        setLatOrigin(originLatLng.lat().toString());
        setLngOrigin(originLatLng.lng().toString());
        setLatDestination(destinationLatLng.lat().toString());
        setLngDestination(destinationLatLng.lng().toString());
        setShowDistance(true);

    }

    const handleTransportTypeChanged = (event) => {
        setTypeOfTransport(event.target.value);
    };

    const handleDestinationChanged = (event) => {
        setDestination(event.target.value);
    };

    const handleOriginChanged = (event) => {
        setOrigin(event.target.value);
    };

    const handleWeightChanged = (event) => {
        setWeight(event.target.value);
    };

    const handleNumberOfItemsChanged = (event) => {
        setNumberOfItems(event.target.value);
    };

    const handlePickupDateChanged = (event) => {
        setPickupDate(event.target.value);
    };

    const handleCostChanged = (event) => {
        setCost(event.target.value);
    };

    const handleAdditionalInformationChanged = (event) => {
        setAdditionalInformation(event.target.value);
    };

    function handleSubmit(){
        addOrder(username,origin,destination,typeOfTransport,weight,numberOfItems,pickupDate,additionalInformation,latOrigin,lngOrigin,latDestination,lngDestination,cost);
        setOrderSent(true);
    }



    return (
        <div>
            {orderSent ?
                <OrderSentResponse
                    origin={origin}
                    destination={destination}
                    transportType={typeOfTransport}
                    weight={weight}
                    numberOfItems={numberOfItems}
                    pickupDate={pickupDate}
                    additionalInformation={additionalInformation}
                    perspective={"client"}
                /> :
                <div className="row clientFormContainer">
                    <div className="col-md-6 col-lg-6">
                        <div className="form-wrapper">
                            <form className="clientFormDiv">
                                <label className="clientFormDiv">
                                    <h6>Location where the order will be picked up:</h6>
                                </label>
                                <Autocomplete>
                                    <input
                                        type='text'
                                        placeholder='Pick-up location'
                                        ref={originRef}
                                        className="clientFormDiv"
                                        onBlur={event=>{calculateRoute();
                                            handleOriginChanged(event);
                                        }}
                                        required
                                    />
                                </Autocomplete>
                                <label className="clientFormDiv">
                                    <h6>Location where the order will be delivered:</h6>
                                </label>
                                <Autocomplete >
                                    <input
                                        type='text'
                                        placeholder='Destination location'
                                        ref={destiantionRef}
                                        className="clientFormDiv"
                                        onBlur={event=>{calculateRoute(); handleDestinationChanged(event);
                                           }}
                                        required
                                    />
                                </Autocomplete>
                                {showDistance ?
                                    <div>
                                        <label className="clientFormDiv">
                                            <h6>Total distance: {distance}</h6>
                                        </label>
                                    </div> : ''}
                                <label className="clientFormDiv">
                                    <h6>Type of transport:</h6>
                                </label>
                                <select id="transport" name="transport" className="clientFormDiv" onChange={handleTransportTypeChanged} required>
                                    <option value="SMALL_PACKAGE">Small package</option>
                                    <option value="FURNITURE_ELECTRONICS">Furniture/Electronic devices</option>
                                    <option value="CAR">Car</option>
                                    <option value="SMALL_VEHICLE">Small vehicle (ex. motorcycle)</option>
                                    <option value="BIG_VEHICLE">Big vehicle (ex. camper van)</option>
                                    <option value="BIKE">Bike/electric scooter</option>
                                    <option value="AGRICULTURAL">Vegetables/Fruits/Agricultural products</option>
                                    <option value="FOOD_PRODUCTS">Different food products</option>
                                    <option value="WOOD">Wood</option>
                                    <option value="CONSTRUCTION_MATERIALS">Construction Materials</option>
                                    <option value="METALS">Metals</option>
                                    <option value="ANIMALS">Animals</option>
                                    <option value="RAW_MATERIALS">Different raw materials</option>
                                    <option value="OIL">Oil</option>
                                    <option value="OTHER">Other (describe at additional information)</option>
                                </select>
                                <br/>
                                <label className="clientFormDiv">
                                    <h6>Weight (optional):</h6>
                                </label>
                                <input type='number' className="clientFormDiv" min="1" onChange={handleWeightChanged}/>
                                <label className="noteLabel">
                                    *Note: for types like food products/ metals/ wood/ construction materials it should be specified
                                </label>
                                <label className="clientFormDiv">
                                    <h6>Number of items to transport (optional):</h6>
                                </label>
                                <input type='number' className="clientFormDiv" min="1" onChange={handleNumberOfItemsChanged}/>
                                <label className="noteLabel">
                                    *Note: for types like small packages/ cars when you have multiple items, for example put 2 if you want for transport two cars
                                </label>
                                <label className="clientFormDiv">
                                    <h6>Date to be picked up (optional):</h6>
                                </label>
                                <input type="date" id="pick-up-date" name="pick-up-date" className="clientFormDiv" onChange={handlePickupDateChanged}/>
                                <label className="clientFormDiv">
                                    <h6>Price you offer (EUR):</h6>
                                </label>
                                <input type='number' className="clientFormDiv" min="1" onChange={handleCostChanged}/>
                                <label className="clientFormDiv">
                                    <h6>Additional information:</h6>
                                </label>
                                <textarea name="additionalInformation" className="clientFormDiv" onChange={handleAdditionalInformationChanged}/>
                                <br/>

                                <input type="button" value="Place order" className="clientFormDiv" onClick={handleSubmit}/>

                            </form>
                        </div>
                    </div>
                    <div className="googleMapsBox col-md-6 col-lg-6">
                        {/* Google FindDriverPage Box */}
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
                                setDirectionRenderer(new google.maps.DirectionsRenderer());
                                setMap(map);
                            }}
                        >
                        </GoogleMap>
                    </div>
                </div>

                }

        </div>
    )
}

export default FindDriverPage;