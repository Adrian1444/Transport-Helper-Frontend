// utils.js
let googleMapsApiLoaded = false;

export const loadGoogleMapsApi = () => {
    return new Promise((resolve, reject) => {
        if (googleMapsApiLoaded) {
            resolve();
        } else {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyASBzBvtlh7tGbEZbf7EWV8pE2hCK3Ypio`;
            script.async = true;
            script.defer = true;
            script.onload = () => {
                googleMapsApiLoaded = true;
                resolve();
            };
            script.onerror = (error) => {
                reject(new Error('Failed to load the Google Maps API: ' + error));
            };
            document.head.appendChild(script);
        }
    });
};
