/**
 * Represents a geographical location with latitude and longitude coordinates.
 */
export interface Location {
  /**
   * The latitude of the location.
   */
  lat: number;
  /**
   * The longitude of the location.
   */
  lng: number;
}

/**
 * Asynchronously retrieves the current location of the user's device using the browser's Geolocation API.
 *
 * @returns A promise that resolves to a Location object containing latitude and longitude.
 * @throws {Error} If the Geolocation API is not available or if permission is denied.
 */
export function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        let message = 'An unknown error occurred while fetching location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'User denied the request for Geolocation.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            message = 'The request to get user location timed out.';
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true, // Request higher accuracy
        timeout: 10000, // Set a timeout of 10 seconds
        maximumAge: 0, // Force a fresh location reading
      }
    );
  });
}
