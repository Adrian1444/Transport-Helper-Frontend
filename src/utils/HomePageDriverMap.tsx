import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {
    GoogleMap,
    LoadScript,
    Marker,
    DirectionsRenderer,
    useJsApiLoader,
    Polyline,
    InfoWindow
} from '@react-google-maps/api';
import {loadGoogleMapsApi} from "./loadGoogleMapsApi";
import {GOOGLE_MAPS_API_KEY} from "../GoogleMapsAPIkey";

const containerStyle = {
    width: '100%',
    height: '100vh',
};

interface Location {
    id: string;
    latitude: number;
    longitude: number;
    idOrder: number;
    type: string;
    name: string;
    orderValue: number;
}

const center = { lat: 48.8584, lng: 2.2945 }


interface HomePageDriverMapProps {
    locations: Location[];
    locationPairs: [Location, Location][];
}


const getMarkerIcon = (type: string): string | google.maps.Icon | google.maps.Symbol | undefined => {
    if (type === 'ORIGIN') {
        return {
            url: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
            scaledSize: new google.maps.Size(32, 32),
        };
    } else if (type === 'DESTINATION') {
        return {
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new google.maps.Size(32, 32),
        };
    } else {
        return undefined;
    }
};

export interface MapHandles {
    changeRouteColor: (pairsToColor: { id1: string, id2: string }[]) => void;
}
const googleMapsApiKey=GOOGLE_MAPS_API_KEY;


const MarkerWithInfoWindow = ({ location, icon }: { location: Location; icon: any }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleMarkerClick = () => {
        setIsOpen(!isOpen);
    };

    const handleInfoWindowClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            <Marker
                key={location.id}
                position={{ lat: location.latitude, lng: location.longitude }}
                icon={icon}
                onClick={handleMarkerClick}
            />
            {isOpen && (
                <InfoWindow
                    position={{ lat: location.latitude, lng: location.longitude }}
                    onCloseClick={handleInfoWindowClose}
                >
                    <div>{location.name}</div>
                </InfoWindow>
            )}
        </>
    );
};

const HomePageDriverMap = forwardRef<MapHandles,HomePageDriverMapProps> (({ locations, locationPairs }, ref) => {
    const [directions, setDirections] = React.useState<google.maps.DirectionsResult[]>([]);

    const [isLoaded,setIsLoaded]=useState(false);
    const [routeColors, setRouteColors] = useState<string[]>(locationPairs.map(() => 'black')); // Initialize route colors

    useEffect(() => {
            const fetchDirections = async () => {
                //await loadGoogleMapsApi(); // Load the Google Maps API

                // eslint-disable-next-line no-undef
                const directionsService = new google.maps.DirectionsService();

                const directionPromises = locationPairs
                .filter((_, index) => routeColors[index] === 'blue')
                .map((pair) =>
                    new Promise((resolve, reject) => {
                        const origin = {lat: pair[0].latitude, lng: pair[0].longitude};
                        const destination = {lat: pair[1].latitude, lng: pair[1].longitude};

                        directionsService.route(
                            {
                                origin,
                                destination,
                                travelMode: google.maps.TravelMode.DRIVING,
                            },
                            (result, status) => {
                                if (status === google.maps.DirectionsStatus.OK) {
                                    resolve(result);
                                } else {
                                    reject(new Error('Error fetching directions: ' + status));
                                }
                            }
                        );
                    })
                );

                try {
                    const results = (await Promise.all(directionPromises)) as google.maps.DirectionsResult[];
                    setDirections(results);
                } catch (error) {
                    console.error('Error fetching directions:', error);
                }

            };

            fetchDirections();

    }, [routeColors]);


    const [forceRerender, setForceRerender] = useState(false);
    const [pairs,setPairs]=useState<{ id1: string, id2: string }[]>([]);

    const changeRouteColor = (pairsToColor: { id1: string, id2: string }[]) => {
        resetRouteColors();
        setPairs(pairsToColor);
        setRouteColors((prevRouteColors) => {
            const newRouteColors = [...prevRouteColors];

            pairsToColor.forEach(pairToColor => {
                const index = locationPairs.findIndex(
                    (pair) => (pair[0].id === pairToColor.id1 && pair[1].id === pairToColor.id2) || (pair[0].id === pairToColor.id2 && pair[1].id === pairToColor.id1)
                );

                if (index !== -1) {
                    newRouteColors[index] = 'blue';
                }
            });

            return newRouteColors;
        });
    };


    const resetRouteColors = () => {
        const initialColors = locationPairs.map(() => 'black');
        setRouteColors(initialColors);
    };

    useImperativeHandle(ref, () => ({
        changeRouteColor,
    }));

    /*

    {locations.map((location) => (
        <Marker
            key={location.id}
            position={{ lat: location.latitude, lng: location.longitude }}
            icon={getMarkerIcon(location.type)}
        />
    ))}
    {
        directions.map((direction, index) =>{
            return (
                <DirectionsRenderer
                    key={`${index}-${forceRerender}`}
                    directions={direction}
                    options={{
                        suppressMarkers: true,
                        polylineOptions: {
                            strokeColor: routeColors[index],
                        },
                    }}
                />
            );
        })}

     */
    const [displayMarkers, setDisplayMarkers] = useState(false);
    const [displayLocationPairs, setDisplayLocationPairs] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDisplayMarkers(true);
            setDisplayLocationPairs(true);
        }, 500);

        return () => clearTimeout(timer); // Clean up timer on unmount
    }, []);


/*
{displayLocationPairs && directions.map((direction, index) => (
                    <DirectionsRenderer
                        key={`direction-${index}-${forceRerender}`}
                        directions={direction}
                        options={{ polylineOptions: { strokeColor: routeColors[index] } }}
                    />
                ))}
 */


    /*
    {displayLocationPairs &&
                locationPairs.map((pair, index) => {
                const path = [{ lat: pair[0].latitude, lng: pair[0].longitude },{ lat: pair[1].latitude, lng: pair[1].longitude }];
                return (
                <Polyline
                key={`${index}-${forceRerender}`}
                path={path}
                options={{
                strokeColor: routeColors[index],
                strokeOpacity: 1,
                strokeWeight: 3,
                }}
                />
                );
            })}
     */
    return (
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={4}>
                {displayMarkers &&
                locations.map((location) => (
                    <MarkerWithInfoWindow key={location.id} location={location} icon={getMarkerIcon(location.type)} />
                ))}

                {displayLocationPairs && directions.map((direction, index) => (
                    <DirectionsRenderer
                        key={`direction-${index}-${forceRerender}`}
                        directions={direction}
                        options={{ polylineOptions: { strokeColor: 'blue' }, suppressMarkers: true }}
                    />
                ))}


            </GoogleMap>
    );
});

export default HomePageDriverMap;
