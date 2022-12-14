// LIBRARY IMPORTS
import React, { useState, useEffect, useRef } from 'react'
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

const intialFormState = {
  address: '',
  coords: '',
  numOfStops: '',
  activities: '',
  radius: '',
}

// Initialize the select options for React Select
const numOfStops = [
  { value: 1, label: 'One', name: 'numOfStops' },
  { value: 2, label: 'Two', name: 'numOfStops' },
  { value: 3, label: 'Three', name: 'numOfStops' },
  { value: 4, label: 'Four', name: 'numOfStops' },
]
const activities = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'dessert', label: 'Dessert' },
  { value: 'bar', label: 'Bar' },
  { value: 'entertainment', label: 'Entertainment' },
]
const radius = [
  { value: 5, label: '5 miles', name: 'radius' },
  { value: 10, label: '10 miles', name: 'radius' },
  { value: 15, label: '15 miles', name: 'radius' },
  { value: 25, label: '25 miles', name: 'radius' },
  { value: 50, label: '50 miles', name: 'radius' },
]

function createNotif(type, message, size) {
  if (type === "success") return Notiflix.Notify.success(message, { timeout: 2000, fontSize: "1rem", width: size, position: "center-top", distance: "65px", clickToClose: true, showOnlyTheLastOne: true })
  if (type === "fail") return Notiflix.Notify.failure(message, { timeout: 2000, fontSize: "1rem", width: size, position: "center-top", distance: "65px", clickToClose: true, showOnlyTheLastOne: true })
}

async function getCities(input) {
  const config = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    }
  }
  const res = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${input}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&country=us&autocomplete=true&proximity=ip&types=address`, config)
  return res.data
}

export default function Home() {

  const [pos, setPos] = useState()
  const [citiesList, setCitiesList] = useState([])
  const [formValues, setFormValues] = useState(intialFormState)
  const [resData, setResData] = useState({})
  const [geojson, setGeojson] = useState({})
  const isFirstRender = useRef(true);

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

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    try {
      if (Object.keys(resData).length === formValues.numOfStops.value) {
        const ll = formValues.coords ? formValues.coords.join() : pos.join()
        let stops = ''
        for (const prop in resData) {
          const coords = resData[prop].results[0].geocodes.main
          stops += coords.latitude + ',' + coords.longitude + '|'
        }
        stops = stops.slice(0, -1)
        console.log(stops)
        getRoute(ll, stops)
      }
    } catch (e) {
      console.log(e)
      console.log('Failed to call the Google Maps API')
    }
  }, [resData])

  // Use the form data to send a get request to the Foursquare Places API
  async function getPlaces(config, activity) {
    const res = await axios.get('https://api.foursquare.com/v3/places/search', config)
    setResData((prevState) => ({ ...prevState, [activity]: res.data }))
  }

  // Send a get request to the Google Maps API to find an optimal route between the stops
  async function getRoute(ll, stops) {
    const config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
      }
    }
    const res = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${ll}&destination=${ll}&waypoints=optimize:true|${stops}&key=${process.env.NEXT_PUBLIC_GOOGLEMAPS_API_KEY}`, config)
    setGeojson(res.data)
    console.log(res.data)
  }

  // Find places for the trip using Foursquare
  const findPlaces = async (e) => {
    e.preventDefault()
    // Validate forms using Notiflix
    if (!pos) {
      createNotif("fail", "Enter a city name.", "220px")
    } else if (formValues.address && !citiesList.some(city => city.value === formValues.address)) {
      createNotif("fail", "Select a city.", "175px")
    } else if (!formValues.numOfStops) {
      createNotif("fail", "Select the number of stops.", "295px")
    } else if (!formValues.activities || formValues.activities.length != formValues.numOfStops.value) {
      createNotif("fail", "Make sure the number of activities and stops match.", "495px")
    } else if (!formValues.radius) {
      createNotif("fail", "Select how far you can go.", "285px")
    } else {
      const ll = formValues.coords ? { ll: formValues.coords.join() } : { ll: pos.join() }
      // Send a get request for each stop
      for (let i = 0; i < formValues.numOfStops.value; i++) {
        const activity = formValues.activities[i].value
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
            ...ll,
            radius: radius,
            // open_now: 'true',
            sort: 'DISTANCE'
          }
        }
        getPlaces(config, activity)
      }
      // Reset the form fields
      // setFormValues(intialFormState)
    }
  }

  // Keep track of the form fields' changes using State
  const onChange = async (e, type) => {
    if (type == 'location') {
      const { value } = e.target
      setFormValues({ ...formValues, address: value })
      if (!value) return
      const res = await getCities(value)
      setCitiesList(res.features.map(feat => ({
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

  return (
    <div>
      <Container className='my-5'>
        <Row className='text-center'>
          <Col>
            <h1 className='display-4'>NightOut</h1>
            <h1 className='display-6'>Use NightOut to plan your next outing wherever you are or whatever you want to do!</h1>
          </Col>
        </Row>
        <Container
          className='py-4 rounded'
          style={{ maxWidth: 550 }}
        >
          <Form onSubmit={findPlaces}>
            <Row>
              <Col>
                <DatalistInput
                  label="Where are you located?"
                  placeholder="Current Location"
                  value={formValues.address}
                  onChange={e => onChange(e, "location")}
                  onSelect={item => setFormValues({ ...formValues, address: item.value, coords: item.coords.reverse() })}
                  items={[...citiesList]}
                />
              </Col>
            </Row>
            <Row>
              <label className='mb-3'>How many stops do you want to make?
                <Select
                  className='py-2'
                  instanceId="formStops"
                  options={numOfStops}
                  placeholder='- Select -'
                  name='numOfStops'
                  value={formValues.numOfStops}
                  onChange={(e) => onChange(e, "select")}
                />
              </label>
            </Row>
            <Row>
              <label className='mb-3'>What do you want to do? (Choose an activity for each stop)
                <Select
                  className='py-2'
                  instanceId="formActivities"
                  options={activities}
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
                  options={radius}
                  placeholder='- Select -'
                  name='radius'
                  value={formValues.radius}
                  onChange={(e) => onChange(e, "select")}
                />
              </label>
            </Row>
            <div className='text-center'>
              <Button variant="outline-light" type="submit">
                Submit
              </Button>
            </div>
          </Form>
        </Container>
        <Container>

        </Container>
      </Container>
    </div >
  )
}