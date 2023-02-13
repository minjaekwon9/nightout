// LIBRARY IMPORTS
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Spinner from 'react-bootstrap/Spinner'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    DirectionsRenderer,
} from '@react-google-maps/api'
import { v4 as uuid } from 'uuid'
import Popup from 'reactjs-popup'
import emailjs from '@emailjs/browser'
import Notiflix from 'notiflix'

// CUSTOM IMPORTS
import { alphabet } from '../constants/Constants'


// Map's center is set to San Francisco
const center = { lat: 37.7749, lng: -122.4194 }
// Google APIs used
const APIs = ['places']

function App() {
    const router = useRouter()
    const query = router.query
    const [names, setNames] = useState([])
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [distances, setDistances] = useState([])
    const [durations, setDurations] = useState([])
    const form = useRef()
    const [url, setUrl] = useState('https://www.google.com/maps/dir/?api=1&travelmode=drive')

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLEMAPS_API_KEY,
        libraries: APIs
    })

    // Calculate the route once after the Google Map has been loaded in
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
        let waypointsURL
        // The loop uses the query parameters to accomplish 3 important functions:
        // 1. Set the parameters for the get request to the Google Maps Directions API to display the trip directions
        // 2. Extract the names of the stops to be displayed in the Trip Details section
        // 3. Create a Google Maps URL that can be shared using EmailJS to see the trip directions on a phone
        for (let i = 1; i <= len; i++) {
            const stop = JSON.parse(query[i])
            setNames(names => [...names, stop.name])
            if (i === 1) {
                origin = stop.coords
                setUrl(url => (url + '&origin=' + encodeURIComponent(stop.coords)))

            } else if (i === len) {
                destination = stop.coords
                setUrl(url => (url + '&destination=' + encodeURIComponent(stop.coords)))
            } else {
                waypoints.push({ location: stop.coords, stopover: true })
                if (!waypointsURL) {
                    waypointsURL = encodeURIComponent(stop.coords)
                } else {
                    waypointsURL = waypointsURL + '%7C' + encodeURIComponent(stop.coords)
                }
            }
        }
        setUrl(url => (url + '&waypoints=' + waypointsURL))
        const results = await directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
            waypoints: waypoints,
        })
        setDirectionsResponse(results)
        const tripInfo = results.routes[0].legs
        // Extract the duration and distance for all the legs of the trip to be displayed in Trip Details
        for (let i = 0; i < tripInfo.length; i++) {
            setDurations(durations => [...durations, tripInfo[i].duration.text])
            setDistances(distances => [...distances, tripInfo[i].distance.text])
        }
    }

    // Send an email with a link to the Google Maps route using EmailJS (to access on the phone)
    const sendEmail = (e) => {
        e.preventDefault()
        emailjs.sendForm('directions_service', 'directions_form', form.current, process.env.NEXT_PUBLIC_EMAILJS_API_KEY)
            .then(() => {
                // Notifications appear based on whether the email went through
                Notiflix.Notify.success("Your directions have been sent.",
                    { timeout: 5000, fontSize: "1rem", width: "560px", distance: "70px", position: "center-top", clickToClose: true, })
            }, (error) => {
                Notiflix.Notify.failure("An error has occurred, please try again.",
                    { timeout: 5000, fontSize: "1rem", width: "390px", distance: "70px", position: "center-top", clickToClose: true, })
            })
        e.target.reset()
    }

    // Render a loading animation if the Map has not loaded in yet
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
                    {/* Display the directions for the trip on a Google Maps Box */}
                    <section className='map'>
                        <GoogleMap
                            className='map'
                            center={center}
                            zoom={15}
                            mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '3px' }}
                            options={{
                                zoomControl: true,
                                streetViewControl: false,
                                mapTypeControl: true,
                                fullscreenControl: true,
                            }}
                        >
                            <Marker position={center} />
                            {directionsResponse && (
                                <DirectionsRenderer directions={directionsResponse} />
                            )}
                        </GoogleMap>
                    </section>
                </Col>
                <Col>
                    <section className='mapInfo'>
                        <header className='mapInfoHeader'>
                            <h4>Trip Details</h4>
                            {/* Open popup that lets you share the directions of the trip through email */}
                            <Popup
                                modal
                                trigger={
                                    <button className='mapInfoText'>
                                        Send the directions to yourself or a friend!
                                    </button>
                                }
                            >
                                {close => (
                                    <div className="mapPopup">
                                        <button className="close" onClick={close}>
                                            &times;
                                        </button>
                                        <h4>Share your route</h4>
                                        <Form ref={form} onSubmit={(e) => {
                                            sendEmail(e)
                                            close()
                                        }}>
                                            <Form.Group as={Row} className="mb-3" controlId="directionsFormName">
                                                <Form.Label column sm="2" >Name: </Form.Label>
                                                <Col sm="10">
                                                    <Form.Control
                                                        required
                                                        name="from_name"
                                                        type="text"
                                                        placeholder="Enter your name"
                                                    />
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row} className="mb-3" controlId="directionsFormEmail">
                                                <Form.Label column sm="2" >Email: </Form.Label>
                                                <Col sm="10">
                                                    <Form.Control
                                                        required
                                                        name="to_email"
                                                        type="email"
                                                        placeholder="Enter the email to send directions to"
                                                    />
                                                </Col>
                                            </Form.Group>
                                            <input name='url' value={url} hidden />
                                            <div className='text-center'>
                                                <Button variant="success" type="submit">
                                                    <p className='m-0 px-3'>Send</p>
                                                </Button>
                                            </div>
                                        </Form>
                                    </div>
                                )}
                            </Popup>
                        </header>
                        <Container fluid>
                            <Row>
                                <Col sm={9}>
                                    {/* Show the duration and distance of the trip */}
                                    <ul className='mapList'>
                                        {names.map((name, index) => {
                                            return (
                                                index < names.length - 1 &&
                                                <div className='mapListItem'>
                                                    <li key={uuid()}>
                                                        <strong>{alphabet[index]}.</strong> {name}
                                                    </li>
                                                    <li key={uuid()}>
                                                        <strong>{alphabet[index + 1]}.</strong> {names[index + 1]}
                                                    </li>
                                                </div>
                                            )
                                        })}
                                    </ul>
                                </Col>
                                <Col sm={3}>
                                    <ul className='mapList'>
                                        {durations.map((duration, index) => (
                                            <div className='mapListItem'>
                                                <li key={uuid()}>
                                                    <strong>{duration}</strong>
                                                </li>
                                                <li key={uuid()}>
                                                    {distances[index]}
                                                </li>
                                            </div>
                                        ))}
                                    </ul>
                                </Col>
                            </Row>
                        </Container>
                    </section>
                </Col>
            </Row>
        </Container>
    )
}

export default App
