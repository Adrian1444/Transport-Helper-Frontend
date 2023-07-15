import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    Autocomplete,
    DirectionsRenderer,
} from '@react-google-maps/api'
import { useRef, useState } from 'react'
import {GOOGLE_MAPS_API_KEY} from "../GoogleMapsAPIkey";

const center = { lat: 48.8584, lng: 2.2945 }

function Map() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ['places'],
    })

    const [map, setMap] = useState(/** @type google.maps.Map */ (null))
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')
    const [directionRenderer,setDirectionRenderer]=useState(null);
    //const [directionsService, setDirectionsService] = useState(null);


    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef()
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destiantionRef = useRef()

    if (!isLoaded) {
        return <p>Loading map...</p>
    }

    async function calculateRoute() {

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
        setDirectionsResponse(results)
        setDistance(results.routes[0].legs[0].distance.text)
        setDuration(results.routes[0].legs[0].duration.text)

    }

    function clearRoute() {
        setDirectionsResponse(null);
        setDistance('');
        setDuration('');
        originRef.current.value = '';
        destiantionRef.current.value = '';
    }


    return (
        <div>
            <div className="row clientFormContainer">
                <div className="col-lg-6">
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
                                    onBlur={calculateRoute}
                                    required
                                />
                            </Autocomplete>
                            <label className="clientFormDiv">
                                <h6>Location where the order will be delivered:</h6>
                            </label>
                            <Autocomplete>
                                <input
                                    type='text'
                                    placeholder='Destination location'
                                    ref={destiantionRef}
                                    className="clientFormDiv"
                                    onBlur={calculateRoute}
                                    required
                                />
                            </Autocomplete>
                            <label className="clientFormDiv">
                                <h6>Type of transport:</h6>
                            </label>
                            <select id="transport" name="transport" className="clientFormDiv" required>
                                <option value="car">Small package</option>
                                <option value="furniture">Furniture/Electronic devices</option>
                                <option value="car">Car</option>
                                <option value="smallVehicle">Small vehicle (ex. motorcycle)</option>
                                <option value="bigVehicle">Big vehicle (ex. camper van)</option>
                                <option value="bike">Bike/electric scooter</option>
                                <option value="agricultural">Vegetables/Fruits/Agricultural products</option>
                                <option value="food">Different food products</option>
                                <option value="wood">Wood</option>
                                <option value="constructionMaterials">Construction Materials</option>
                                <option value="metals">Metals</option>
                                <option value="animals">Animals</option>
                                <option value="rawMaterials">Different raw materials</option>
                                <option value="car">Oil</option>
                                <option value="furniture">Other (describe at more information part)</option>
                            </select>
                            <br/>
                            <label className="clientFormDiv">
                                <h6>Weight (optional):</h6>
                            </label>
                            <input type='number' className="clientFormDiv" min="1"/>
                            <label className="noteLabel">
                                *Note: for types like food products/ metals/ wood/ construction materials it should be specified
                            </label>
                            <label className="clientFormDiv">
                                <h6>Number of items to transport (optional):</h6>
                            </label>
                            <input type='number' className="clientFormDiv" min="1"/>
                            <label className="noteLabel">
                                *Note: for types like small packages/ cars when you have multiple items, for example put 2 if you want for transport two cars
                            </label>
                            <label className="clientFormDiv">
                                <h6>Date to be picked up (optional):</h6>
                            </label>
                            <input type="date" id="pick-up-date" name="pick-up-date" className="clientFormDiv"/>
                            <br/>

                            <input type='submit' value="Place order" className="clientFormDiv"/>

                        </form>
                    </div>
                </div>
                <div className="googleMapsBox col-lg-6">
                    {/* Google FindDriverPage Box */}
                    <GoogleMap
                        center={center}
                        zoom={15}
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        options={{
                            zoomControl: false,
                            streetViewControl: false,
                            mapTypeControl: false,
                            fullscreenControl: false,
                        }}
                        onLoad={map => setMap(map)}
                    >
                        {directionsResponse ?
                            <DirectionsRenderer options={{
                                suppressMarkers: true,
                            }} directions={directionsResponse}
                                                onLoad={directionsRenderer => setDirectionRenderer(directionsRenderer)}/> : ''
                        }
                    </GoogleMap>
                </div>

            </div>
        </div>
    )
}

export default Map;