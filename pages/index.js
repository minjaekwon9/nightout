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

// CUSTOM IMPORTS


const intialFormState = {
  location: '',
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

export default function Home() {

  const [pos, setPos] = useState()
  const [formValues, setFormValues] = useState(intialFormState)
  const [resData, setResData] = useState({})

  useEffect(() => {
    // Check if "geolocation" exists using "?." (null access check) and grab the user's current coordinates if so
    navigator?.geolocation.getCurrentPosition(({ coords: { latitude: lat, longitude: lng } }) => {
      const pos = { lat, lng }
      setPos({ pos })
      if (pos) {
        createNotif("success", "Updated the current location.", "310px")
      }
    })
  }, [])

  // Find places for the trip using Foursquare
  const findPlaces = (e) => {
    e.preventDefault()
    // Validate forms using Notiflix
    if (!pos) {
      createNotif("fail", "Enter the location.", "220px")
    } else if (!formValues.numOfStops) {
      createNotif("fail", "Select the number of stops.", "295px")
    } else if (!formValues.activities || formValues.activities.length != formValues.numOfStops.value) {
      createNotif("fail", "Make sure the number of activities and stops match.", "495px")
    } else if (!formValues.radius) {
      createNotif("fail", "Select how far you can go.", "285px")
    } else {
      // Use the form data to send a get request to the Foursquare Places API
      async function getPlaces(config, activity) {
        const res = await axios.get('https://api.foursquare.com/v3/places/search', config)
        console.log(res.data)
        setResData((prevState) => ({ ...prevState, [activity]: res.data }))
      }
      // Send a get request for each stop
      for (let i = 0; i < formValues.numOfStops.value; i++) {
        const activity = formValues.activities[i].value
        const radius = formValues.radius.value * 1609
        const config = {
          headers: {
            Accept: 'application/json',
            Authorization: 'fsq3dVwzOnzP0tuP8fE5mC6DPZUg6ZKJym59TSNTRmMa0dw=',
          },
          params: {
            query: activity,
            ll: pos,
            radius: radius,
            open_now: 'true',
            sort: 'DISTANCE'
          }
        }
        getPlaces(config, activity)
      }
      // Reset the form fields
      setFormValues(intialFormState)
    }
  }

  // Keep track of the form fields' changes using State
  const onChange = (e, type) => {
    if (type == 'text') {
      const { name, value } = e.target
      setFormValues({ ...formValues, [name]: value })
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
              <Form.Group className="mb-3" controlId="formLocation">
                <Form.Label>Where are you located?</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Current Location"
                  name='location'
                  value={formValues.location}
                  onChange={(e) => onChange(e, "text")}
                />
              </Form.Group>
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
                  name='activities'
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
      </Container>
    </div>
  )
}
