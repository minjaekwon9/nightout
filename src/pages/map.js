// LIBRARY IMPORTS
import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    DirectionsRenderer,
} from '@react-google-maps/api'

// CUSTOM IMPORTS

// Map's center is set to San Francisco
const center = { lat: 37.7749, lng: -122.4194 }
// Google APIs used
const APIs = ['places']

function App() {
    const router = useRouter()
    let query = Object.values(router.query)
    const [map, setMap] = useState(null)
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLEMAPS_API_KEY,
        libraries: APIs
    })

    useEffect(() => {
        if (!isLoaded) return
        calculateRoute()
    }, [isLoaded])

    async function calculateRoute() {
        const directionsService = new google.maps.DirectionsService()
        const origin = query.shift()
        const destination = query.pop()
        const waypoints = []
        query.forEach(waypoint => waypoints.push({ location: waypoint, stopover: true }))
        const results = await directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
            waypoints: waypoints,
            // optimizeWaypoints: true
        })
        console.log(results)
        setDirectionsResponse(results)
        setDistance(results.routes[0].legs[0].distance.text)
        setDuration(results.routes[0].legs[0].duration.text)
    }

    if (!isLoaded) {
        return (
            <div className='loading'>
                <Spinner animation='border'></Spinner>
            </div>
        )
    }

    return (
        <Container fluid>
            <Row>
                <Col>
                    {/* Google Map Box */}
                    <div className='map'>
                        <GoogleMap
                            center={center}
                            zoom={15}
                            mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '5px' }}
                            options={{
                                zoomControl: true,
                                streetViewControl: false,
                                mapTypeControl: true,
                                fullscreenControl: true,
                            }}
                            onLoad={map => setMap(map)}
                        >
                            <Marker position={center} />
                            {directionsResponse && (
                                <DirectionsRenderer directions={directionsResponse} />
                            )}
                        </GoogleMap>
                    </div>
                </Col>
                <Col>
                    <div className='mapInfo'>
                        <div className='mapInfoHeader'>
                            <h4>Trip Details</h4>
                        </div>
                        <div>
                            <p>Distance: {distance} </p>
                            <p>Duration: {duration} </p>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default App
