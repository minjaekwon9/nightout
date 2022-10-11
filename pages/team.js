// LIBRARY IMPORTS
import { default as Navbar } from '../components/Navbar'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function Team() {
    return (
        <div>
            <Navbar />
            <Container>
                <Row className='my-5'>
                    <Col className='text-center'>
                        <h1>NightOut Team</h1>
                    </Col>
                </Row>
                <Row style={{ maxWidth: 900 }}>
                    <Col md="6" lg="5">
                        <img
                            src="minjae.jpeg"
                            alt="Headshot of Minjae Kwon"
                            style={{ borderRadius: 10 }}
                        />
                    </Col>
                    <Col md="6" lg="7">
                        <h3>Minjae Kwon</h3>
                        <h6 className='my-3'>Software Engineer</h6>
                        <p>
                            Focused on creating a great user experience on web-based
                            applications. Has experience in developing consumer-focused websites
                            using React.
                        </p>
                    </Col>
                </Row>
            </Container>
        </div >
    )
}