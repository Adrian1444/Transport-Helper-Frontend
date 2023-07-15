import React, {useMemo} from "react";
import {GoogleMap, useLoadScript, MarkerF} from "@react-google-maps/api";
import {GOOGLE_MAPS_API_KEY} from "../GoogleMapsAPIkey";

interface LocationProps {
    lat: number;
    lng: number;
}

const GoogleMapsLocation: React.FC<LocationProps> = (locationProps) => {
    const {isLoaded} = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });

    if (!isLoaded) return <div>Loading...</div>;
    return <Map
        lat={locationProps.lat}
        lng={locationProps.lng}
    />;
}

const Map: React.FC<LocationProps> = (locationProps) => {
    const center = useMemo(() => ({lat: locationProps.lat, lng: locationProps.lng}), []);
    return (
        <GoogleMap zoom={10} center={center} mapContainerClassName="map-container">
            <MarkerF position={center}/>
        </GoogleMap>
    );
}

export default GoogleMapsLocation;