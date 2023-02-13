// LIBRARY IMPORTS
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Select from 'react-select'
import Notiflix from 'notiflix'
import axios from "axios"
import DatalistInput from 'react-datalist-input'

// CUSTOM IMPORTS
import * as Constants from '../constants/Constants'


// Create a notifications when performing specific actions
function createNotif(type, message, size) {
  if (type === "success") return Notiflix.Notify.success(message, { timeout: 2000, fontSize: "1rem", width: size, position: "center-top", distance: "65px", clickToClose: true, showOnlyTheLastOne: true })
  if (type === "fail") return Notiflix.Notify.failure(message, { timeout: 2000, fontSize: "1rem", width: size, position: "center-top", distance: "65px", clickToClose: true, showOnlyTheLastOne: true })
}

// Fetch a list of potential addresses in the US from the provided input using the Mapbox Geocoding API
async function getAddresses(input) {
  const res = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${input}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&country=us&autocomplete=true&proximity=ip&types=address`)
  return res.data
}

export default function Home() {

  const [pos, setPos] = useState()
  const [addressList, setAddressList] = useState([])
  const [formValues, setFormValues] = useState(Constants.initialFormState)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if "geolocation" exists using "?." (null access check) and grab the user's current coordinates if so
    navigator?.geolocation.getCurrentPosition(({ coords: { latitude: lat, longitude: lng } }) => {
      const pos = [lat, lng]
      setPos(pos)
      if (pos) {
        createNotif("success", "Updated the current location.", "310px")
      }
    })
  }, [])

  // Use the form data to send a get request to the Foursquare Places API
  async function getPlaces(config) {
    const res = await axios.get('https://api.foursquare.com/v3/places/search', config)
    const name = res.data.results[0].name
    const coords = res.data.results[0].geocodes.main.latitude + ',' + res.data.results[0].geocodes.main.longitude
    const locationData = { name, coords }
    return JSON.stringify(locationData)
  }

  // Keep track of the form fields' changes using State
  const onChange = async (e, type) => {
    // Alter behavior based on which form field is being changed
    if (type == 'location') {
      // Display a list of addresses that match the input
      const { value } = e.target
      setFormValues({ ...formValues, address: value })
      if (!value) return
      const res = await getAddresses(value)
      setAddressList(res.features.map(feat => ({
        id: feat.place_name,
        value: feat.place_name,
        coords: feat.geometry.coordinates
      })))
    } else if (type == 'select') {
      const { name } = e
      setFormValues({ ...formValues, [name]: e })
    } else if (type == 'activities') {
      const numOfStops = formValues.numOfStops.value
      if (numOfStops) {
        // Check if activities exceed the number of stops selected
        e.length <= numOfStops
          ? setFormValues({ ...formValues, activities: e })
          : createNotif("fail", "Add more stops to add more activities.", "385px")
      } else {
        // Check if number of stops has been selected first
        createNotif("fail", "Please select the number of stops first.", "390px")
      }
    }
  }

  // Find places for the trip using Foursquare
  const findPlaces = async (e) => {
    e.preventDefault()
    // Validate forms using Notiflix
    if (!pos) {
      createNotif("fail", "Enter your address.", "220px")
    } else if (formValues.address && !addressList.some(city => city.value === formValues.address)) {
      createNotif("fail", "Select your address.", "175px")
    } else if (!formValues.numOfStops) {
      createNotif("fail", "Select the number of stops.", "295px")
    } else if (!formValues.activities || formValues.activities.length != formValues.numOfStops.value) {
      createNotif("fail", "Make sure the number of activities and stops match.", "495px")
    } else if (!formValues.radius) {
      createNotif("fail", "Select how far you can go.", "285px")
    } else {
      try {
        setLoading(true)
        const name = formValues.address ? formValues.address.split(",")[0] : 'Current Location'
        const coords = formValues.coords ? { ll: formValues.coords.join() } : { ll: pos.join() }
        const query = { 1: JSON.stringify({ name, coords: coords.ll }) }
        // Send a get request to the Foursquare Places API for each stop
        for (let i = 0; i < formValues.numOfStops.value; i++) {
          const activity = formValues.activities[i].value
          // Convert radius from miles to meters
          const radius = formValues.radius.value * 1609
          const config = {
            headers: {
              Accept: 'application/json',
              Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
            },
            params: {
              query: activity,
              ...coords,
              radius: radius,
              // open_now: 'true',
              sort: 'DISTANCE'
            }
          }
          query[i + 2] = await getPlaces(config)
        }
        router.push({
          pathname: '/map',
          query: { ...query }
        })
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }
  }

  return (
    <div>
      <Container className='my-5'>
        <Row>
          <Col className='d-flex justify-content-center align-items-center'>
            <img
              src="/icon.svg"
              width="50"
              height="50"
              className="d-inline me-2 mb-2"
              alt="NightOut logo"
            />
            <h1 className='d-inline-block display-4'>NightOut</h1>
          </Col>
        </Row>
        <Row className='text-center'>
          <Col>
            <h1 className='display-6'>Use NightOut to plan your next outing wherever you are or whatever you want to do!</h1>
          </Col>
        </Row>
        <Container
          className='py-4 rounded'
          style={{ maxWidth: 550 }}
        >
          {/* React Bootstrap Form used to input the requirements for your day trip */}
          <Form onSubmit={findPlaces}>
            <Row>
              <Col>
                {/* Datalist displays the address list received from the Mapbox API */}
                <DatalistInput
                  label="Where are you located?"
                  placeholder="Current Location"
                  value={formValues.address}
                  onChange={e => onChange(e, "location")}
                  onSelect={item => setFormValues({ ...formValues, address: item.value, coords: item.coords.reverse() })}
                  items={[...addressList]}
                />
              </Col>
            </Row>
            <Row>
              <label className='mb-3'>How many stops do you want to make?
                <Select
                  className='py-2'
                  instanceId="formStops"
                  options={Constants.numOfStops}
                  placeholder='- Select -'
                  name='numOfStops'
                  value={formValues.numOfStops}
                  onChange={(e) => onChange(e, "select")}
                />
              </label>
            </Row>
            <Row>
              <label className='mb-3'>What do you want to do? (Please add the activities in the order you want to do them.)
                <Select
                  className='py-2'
                  instanceId="formActivities"
                  options={Constants.activities}
                  // closeMenuOnSelect={false}
                  isMulti
                  placeholder='- Select -'
                  value={formValues.activities}
                  onChange={(e) => onChange(e, "activities")}
                />
              </label>
            </Row>
            <Row>
              <label className='mb-3'>How far are you willing to travel?
                <Select
                  className='py-2'
                  instanceId="formRadius"
                  options={Constants.radius}
                  placeholder='- Select -'
                  name='radius'
                  value={formValues.radius}
                  onChange={(e) => onChange(e, "select")}
                />
              </label>
            </Row>
            <div className='text-center'>
              {!loading ?
                <Button variant="outline-light" type="submit">
                  Submit
                </Button> :
                <Button variant="outline-light" disabled>
                  Loading...
                </Button>
              }
            </div>
          </Form>
        </Container>
      </Container>
    </div >
  )
}