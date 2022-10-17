// LIBRARY IMPORTS
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// CUSTOM IMPORTS
import { default as Navbar } from '../components/Navbar'

export default function About() {
    return (
        <div>
            <Navbar />
            <Container>
                <Row className='my-5'>
                    <Col sm="10" md="8" lg="6">
                        <h1 className='mb-4 display-3'>What is NightOut?</h1>
                        <p>NightOut is an easy way to plan a day trip with your friends without worry or any surprises. Just put in your location and how far away the stops can be and NightOut will look for fun activities within your area. You can choose how many activities to add to your trip and what type of activites best suits your desires. After planning your perfect trip, you can share it with your friends so everybody is in the know.</p>
                    </Col>
                    <Col sm="2" md="4" lg="6"></Col>
                </Row>
            </Container>
        </div>
    )
}