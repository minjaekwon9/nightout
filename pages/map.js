// LIBRARY IMPORTS
import { useRef, useState } from 'react'
import Spinner from 'react-bootstrap/Spinner';
import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    DirectionsRenderer,
} from '@react-google-maps/api'

// CUSTOM IMPORTS


const center = { lat: 37.7749, lng: -122.4194 }

function App() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLEMAPS_API_KEY,
        libraries: ['places'],
    })

    const [map, setMap] = useState(null)
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')

    const originRef = useRef()
    const destiantionRef = useRef()

    async function calculateRoute() {
        if (originRef.current.value === '' || destiantionRef.current.value === '') {
            return
        }
        console.log(originRef.current.value)
        console.log(destiantionRef.current.value)
        const bubb = "7509 Balmoral Way, San Ramon, CA, USA"
        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService()
        const results = await directionsService.route({
            origin: "207 Cullens Court, San Ramon, CA, USA",
            destination: "351 Enfield St, San Ramon, CA, USA",
            // eslint-disable-next-line no-undef
            travelMode: google.maps.TravelMode.DRIVING,
            waypoints: [{ location: "7509 Balmoral Way, San Ramon, CA, USA", stopover: true }, { location: "1272 Halifax Way, San Ramon, CA, USA", stopover: true }],
            // optimizeWaypoints: true
        })
        console.log(results)
        setDirectionsResponse(results)
        setDistance(results.routes[0].legs[0].distance.text)
        setDuration(results.routes[0].legs[0].duration.text)
    }

    function clearRoute() {
        setDirectionsResponse(null)
        setDistance('')
        setDuration('')
        originRef.current.value = ''
        destiantionRef.current.value = ''
    }

    if (!isLoaded) {
        return (
            <div className='loading'>
                <Spinner animation='border'></Spinner>
            </div>
        )
    }

    return (
        <div>
            {/* Google Map Box */}
            <div className='map'>
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
                    <Marker position={center} />
                    {directionsResponse && (
                        <DirectionsRenderer directions={directionsResponse} />
                    )}
                </GoogleMap>
            </div>
            <input type='text' placeholder='Origin' ref={originRef} />
            <input type='text' placeholder='Destination' ref={destiantionRef} />
            <button type='submit' onClick={calculateRoute}>
                Calculate Route
            </button>
            <p>Distance: {distance} </p>
            <p>Duration: {duration} </p>
            <button onClick={() => {
                map.panTo(center)
                map.setZoom(15)
            }}>
                Jump to center
            </button>
        </div >
    )
}

export default App
