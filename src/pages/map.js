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
    const query = router.query
    const [map, setMap] = useState(null)
    const [names, setNames] = useState([])
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [distances, setDistances] = useState([])
    const [durations, setDurations] = useState([])

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
        const len = Object.keys(query).length
        let origin = ''
        let destination = ''
        let waypoints = []
        for (let i = 1; i <= len; i++) {
            const stop = JSON.parse(query[i])
            setNames(names => [...names, stop.name])
            if (i === 1) {
                origin = stop.coords
            } else if (i === len) {
                destination = stop.coords
            } else {
                waypoints.push({ location: stop.coords, stopover: true })
            }
        }
        const results = await directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
            waypoints: waypoints,
            // optimizeWaypoints: true
        })
        setDirectionsResponse(results)
        const tripInfo = results.routes[0].legs
        for (let i = 0; i < tripInfo.length; i++) {
            setDistances(distances => [...distances, tripInfo[i].distance.text])
            setDurations(durations => [...durations, tripInfo[i].duration.text])
        }
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
                        <Container>
                            <Row>
                                <Col>
                                    {names.map((name, index) => {
                                        return (
                                            index < names.length - 1 &&
                                            <div>
                                                <div>
                                                    From {name}
                                                </div>
                                                <div>
                                                    To {names[index + 1]}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </Col>
                                <Col>
                                    {distances.map((distance, index) => (
                                        <div>
                                            <p>{distance}</p>
                                            <p>{durations[index]}</p>
                                        </div>
                                    ))}
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default App
