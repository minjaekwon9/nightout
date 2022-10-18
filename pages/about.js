// LIBRARY IMPORTS
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// CUSTOM IMPORTS


export default function About() {
    return (
        <div>
            <Container>
                <Row className='my-5'>
                    <Col sm="10" md="8" lg="7">
                        <h1 className='mb-4 display-4'>What is NightOut?</h1>
                        <p style={{ lineHeight: 1.7 }}>NightOut is an easy way to plan an outing with your friends without worry or any surprises.</p>
                        <p>Just put in your location and how far away the stops can be and NightOut will look for fun activities within your area. You can choose how many activities to add to your trip and what type of activites best suits your desires.</p>
                        <p>After planning your perfect trip, you can share it with your friends so everybody is in the know.</p>
                    </Col>
                    <Col sm="2" md="4" lg="3"></Col>
                </Row>
            </Container>
        </div>
    )
}